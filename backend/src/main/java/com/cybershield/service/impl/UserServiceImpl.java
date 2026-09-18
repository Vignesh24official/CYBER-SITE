package com.cybershield.service.impl;

import com.cybershield.dto.common.PageResponse;
import com.cybershield.dto.user.UserDto;
import com.cybershield.entity.Role;
import com.cybershield.entity.User;
import com.cybershield.enums.AccountStatus;
import com.cybershield.enums.AuditAction;
import com.cybershield.enums.RoleName;
import com.cybershield.exception.ResourceNotFoundException;
import com.cybershield.repository.RoleRepository;
import com.cybershield.repository.UserRepository;
import com.cybershield.security.SecurityUtils;
import com.cybershield.security.UserPrincipal;
import com.cybershield.service.AuditLogService;
import com.cybershield.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuditLogService auditLogService;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserDto> getUsers(RoleName roleName, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> users;
        if (roleName != null) {
            users = userRepository.findByRole_Name(roleName, pageRequest);
        } else {
            users = userRepository.findAll(pageRequest);
        }
        return PageResponse.from(users.map(this::mapToUserDto));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getInvestigators() {
        return userRepository.findByRole_Name(RoleName.ROLE_INVESTIGATOR)
                .stream()
                .map(this::mapToUserDto)
                .collect(Collectors.toList());
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
        User saved = userRepository.save(targetUser);

        auditLogService.logAction(
                admin, AuditAction.USER_DISABLED, "USER", targetUser.getPublicId(),
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
