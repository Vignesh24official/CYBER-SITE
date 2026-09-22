package com.cybershield.service.impl;

import com.cybershield.dto.common.PageResponse;
import com.cybershield.dto.user.AdminUserCreateRequest;
import com.cybershield.dto.user.AdminUserUpdateRequest;
import com.cybershield.dto.user.CoordinatorSummaryDto;
import com.cybershield.dto.user.UserDto;
import com.cybershield.entity.Role;
import com.cybershield.entity.User;
import com.cybershield.enums.AccountStatus;
import com.cybershield.enums.AssignmentStatus;
import com.cybershield.enums.AuditAction;
import com.cybershield.enums.RoleName;
import com.cybershield.exception.DuplicateResourceException;
import com.cybershield.exception.ResourceNotFoundException;
import com.cybershield.repository.AssignmentRepository;
import com.cybershield.repository.RoleRepository;
import com.cybershield.repository.UserRepository;
import com.cybershield.security.SecurityUtils;
import com.cybershield.security.UserPrincipal;
import com.cybershield.service.AuditLogService;
import com.cybershield.service.UserService;
import com.cybershield.specification.UserSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AssignmentRepository assignmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserDto> getUsers(String search, RoleName roleName, AccountStatus status, int page, int size, String sortBy, String sortDir) {
        String sortProperty = "createdAt";
        if ("fullName".equalsIgnoreCase(sortBy) || "name".equalsIgnoreCase(sortBy)) {
            sortProperty = "fullName";
        } else if ("email".equalsIgnoreCase(sortBy)) {
            sortProperty = "email";
        } else if ("lastLoginAt".equalsIgnoreCase(sortBy)) {
            sortProperty = "lastLoginAt";
        }

        Sort sort = "asc".equalsIgnoreCase(sortDir) ? Sort.by(sortProperty).ascending() : Sort.by(sortProperty).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Specification<User> spec = UserSpecification.filterUsers(search, roleName, status);
        Page<User> userPage = userRepository.findAll(spec, pageRequest);

        return PageResponse.from(userPage.map(this::mapToUserDto));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getInvestigators() {
        return userRepository.findByRole_NameIn(List.of(RoleName.ROLE_INVESTIGATOR, RoleName.ROLE_COORDINATOR))
                .stream()
                .map(this::mapToUserDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CoordinatorSummaryDto> getCoordinators() {
        List<User> staff = userRepository.findByRole_NameIn(List.of(RoleName.ROLE_COORDINATOR, RoleName.ROLE_INVESTIGATOR));
        List<CoordinatorSummaryDto> result = new ArrayList<>();

        for (User u : staff) {
            long totalAssigned = assignmentRepository.countByInvestigatorId(u.getId());
            long activeCases = assignmentRepository.countByInvestigatorIdAndAssignmentStatus(u.getId(), AssignmentStatus.ACTIVE);
            long completedCases = Math.max(0, totalAssigned - activeCases);

            result.add(CoordinatorSummaryDto.builder()
                    .publicId(u.getPublicId())
                    .fullName(u.getFullName())
                    .email(u.getEmail())
                    .phone(u.getPhone())
                    .role(u.getRole().getName().name())
                    .accountStatus(u.getAccountStatus())
                    .activeCasesCount(activeCases)
                    .totalAssignedCount(totalAssigned)
                    .completedCount(completedCases)
                    .createdAt(u.getCreatedAt())
                    .lastLoginAt(u.getLastLoginAt())
                    .build());
        }

        return result;
    }

    @Override
    @Transactional
    public UserDto createUser(AdminUserCreateRequest request) {
        UserPrincipal adminPrincipal = SecurityUtils.getCurrentUser();
        User admin = userRepository.findById(adminPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new DuplicateResourceException("Email address is already registered");
        }

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.getRole()));

        User user = User.builder()
                .publicId(UUID.randomUUID().toString())
                .fullName(request.getFullName().trim())
                .email(request.getEmail().toLowerCase().trim())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .accountStatus(request.getAccountStatus() != null ? request.getAccountStatus() : AccountStatus.ACTIVE)
                .failedLoginAttempts(0)
                .build();

        User savedUser = userRepository.save(user);

        auditLogService.logAction(
                admin, AuditAction.USER_CREATED, "USER", savedUser.getPublicId(),
                "Admin created new account for " + savedUser.getEmail() + " with role " + role.getName().name()
        );

        return mapToUserDto(savedUser);
    }

    @Override
    @Transactional
    public UserDto updateUser(String publicId, AdminUserUpdateRequest request) {
        UserPrincipal adminPrincipal = SecurityUtils.getCurrentUser();
        User admin = userRepository.findById(adminPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        User targetUser = userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with public ID: " + publicId));

        String newEmail = request.getEmail().toLowerCase().trim();
        if (!targetUser.getEmail().equalsIgnoreCase(newEmail) && userRepository.existsByEmail(newEmail)) {
            throw new DuplicateResourceException("Email address already in use by another account");
        }

        targetUser.setFullName(request.getFullName().trim());
        targetUser.setEmail(newEmail);
        targetUser.setPhone(request.getPhone());

        if (request.getRole() != null) {
            Role role = roleRepository.findByName(request.getRole())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.getRole()));
            targetUser.setRole(role);
        }

        if (request.getAccountStatus() != null) {
            targetUser.setAccountStatus(request.getAccountStatus());
            if (request.getAccountStatus() == AccountStatus.ACTIVE) {
                targetUser.setFailedLoginAttempts(0);
                targetUser.setLockTime(null);
            }
        }

        User saved = userRepository.save(targetUser);

        auditLogService.logAction(
                admin, AuditAction.USER_UPDATED, "USER", targetUser.getPublicId(),
                "Admin updated account details for " + targetUser.getEmail()
        );

        return mapToUserDto(saved);
    }

    @Override
    @Transactional
    public UserDto updateUserStatus(String publicId, AccountStatus status) {
        UserPrincipal adminPrincipal = SecurityUtils.getCurrentUser();
        User admin = userRepository.findById(adminPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        User targetUser = userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with public ID: " + publicId));

        targetUser.setAccountStatus(status);
        if (status == AccountStatus.ACTIVE) {
            targetUser.setFailedLoginAttempts(0);
            targetUser.setLockTime(null);
        }
        User saved = userRepository.save(targetUser);

        auditLogService.logAction(
                admin, status == AccountStatus.ACTIVE ? AuditAction.USER_ENABLED : AuditAction.USER_DISABLED,
                "USER", targetUser.getPublicId(),
                "Updated user account status to " + status
        );

        return mapToUserDto(saved);
    }

    @Override
    @Transactional
    public UserDto updateUserRole(String publicId, RoleName roleName) {
        UserPrincipal adminPrincipal = SecurityUtils.getCurrentUser();
        User admin = userRepository.findById(adminPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        User targetUser = userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with public ID: " + publicId));

        Role newRole = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));

        targetUser.setRole(newRole);
        User saved = userRepository.save(targetUser);

        auditLogService.logAction(
                admin, AuditAction.USER_UPDATED, "USER", targetUser.getPublicId(),
                "Updated user role to " + roleName
        );

        return mapToUserDto(saved);
    }

    @Override
    @Transactional
    public void deleteUser(String publicId) {
        UserPrincipal adminPrincipal = SecurityUtils.getCurrentUser();
        User admin = userRepository.findById(adminPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        User targetUser = userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with public ID: " + publicId));

        if (targetUser.getId().equals(admin.getId())) {
            throw new IllegalArgumentException("You cannot delete your own administrative account");
        }

        if (targetUser.getRole().getName() == RoleName.ROLE_ADMIN && userRepository.countByRole_Name(RoleName.ROLE_ADMIN) <= 1) {
            throw new IllegalArgumentException("Cannot delete the only remaining system administrator account");
        }

        userRepository.delete(targetUser);

        auditLogService.logAction(
                admin, AuditAction.USER_DELETED, "USER", publicId,
                "Deleted user account: " + targetUser.getEmail() + " (" + targetUser.getFullName() + ")"
        );
    }

    @Override
    @Transactional
    public void resetPassword(String publicId, String newPassword) {
        UserPrincipal adminPrincipal = SecurityUtils.getCurrentUser();
        User admin = userRepository.findById(adminPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        User targetUser = userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with public ID: " + publicId));

        targetUser.setPasswordHash(passwordEncoder.encode(newPassword));
        targetUser.setFailedLoginAttempts(0);
        targetUser.setLockTime(null);
        if (targetUser.getAccountStatus() == AccountStatus.LOCKED) {
            targetUser.setAccountStatus(AccountStatus.ACTIVE);
        }
        userRepository.save(targetUser);

        auditLogService.logAction(
                admin, AuditAction.USER_UPDATED, "USER", targetUser.getPublicId(),
                "Admin reset password for user " + targetUser.getEmail()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getUserStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("activeUsers", userRepository.countByAccountStatus(AccountStatus.ACTIVE));
        stats.put("suspendedUsers", userRepository.countByAccountStatus(AccountStatus.SUSPENDED));
        stats.put("lockedUsers", userRepository.countByAccountStatus(AccountStatus.LOCKED));
        stats.put("coordinatorsCount", userRepository.countByRole_Name(RoleName.ROLE_COORDINATOR) + userRepository.countByRole_Name(RoleName.ROLE_INVESTIGATOR));
        stats.put("citizensCount", userRepository.countByRole_Name(RoleName.ROLE_USER));
        stats.put("adminsCount", userRepository.countByRole_Name(RoleName.ROLE_ADMIN));
        return stats;
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .publicId(user.getPublicId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().getName().name())
                .accountStatus(user.getAccountStatus())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }
}
