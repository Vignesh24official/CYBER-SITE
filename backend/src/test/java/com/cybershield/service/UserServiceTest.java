package com.cybershield.service;

import com.cybershield.dto.user.AdminUserCreateRequest;
import com.cybershield.dto.user.CoordinatorSummaryDto;
import com.cybershield.dto.user.UserDto;
import com.cybershield.entity.Role;
import com.cybershield.entity.User;
import com.cybershield.enums.AccountStatus;
import com.cybershield.enums.AssignmentStatus;
import com.cybershield.enums.RoleName;
import com.cybershield.exception.DuplicateResourceException;
import com.cybershield.repository.AssignmentRepository;
import com.cybershield.repository.RoleRepository;
import com.cybershield.repository.UserRepository;
import com.cybershield.security.UserPrincipal;
import com.cybershield.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private AssignmentRepository assignmentRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private UserServiceImpl userService;

    private User adminUser;
    private Role adminRole;
    private Role coordinatorRole;

    @BeforeEach
    void setUp() {
        adminRole = new Role(1L, RoleName.ROLE_ADMIN);
        coordinatorRole = new Role(2L, RoleName.ROLE_COORDINATOR);

        adminUser = User.builder()
                .id(1L)
                .publicId("admin-pub-id")
                .fullName("System Admin")
                .email("admin@cybershield.org")
                .role(adminRole)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        UserPrincipal principal = UserPrincipal.create(adminUser);
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    @DisplayName("Admin can create new coordinator account successfully")
    void testCreateCoordinatorUser() {
        AdminUserCreateRequest request = AdminUserCreateRequest.builder()
                .fullName("Jane Coordinator")
                .email("jane.coord@cybershield.org")
                .phone("+1-555-0199")
                .password("Password@123")
                .role(RoleName.ROLE_COORDINATOR)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(adminUser));
        when(userRepository.existsByEmail("jane.coord@cybershield.org")).thenReturn(false);
        when(roleRepository.findByName(RoleName.ROLE_COORDINATOR)).thenReturn(Optional.of(coordinatorRole));
        when(passwordEncoder.encode(any())).thenReturn("hashedPass");

        User savedUser = User.builder()
                .id(2L)
                .publicId("coord-uuid-1")
                .fullName("Jane Coordinator")
                .email("jane.coord@cybershield.org")
                .phone("+1-555-0199")
                .role(coordinatorRole)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserDto result = userService.createUser(request);

        assertNotNull(result);
        assertEquals("Jane Coordinator", result.getFullName());
        assertEquals("ROLE_COORDINATOR", result.getRole());
        verify(auditLogService, times(1)).logAction(any(), any(), any(), any(), any());
    }

    @Test
    @DisplayName("Admin creating duplicate email throws DuplicateResourceException")
    void testCreateUserDuplicateEmail() {
        AdminUserCreateRequest request = AdminUserCreateRequest.builder()
                .fullName("Duplicate User")
                .email("admin@cybershield.org")
                .password("Password@123")
                .role(RoleName.ROLE_USER)
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(adminUser));
        when(userRepository.existsByEmail("admin@cybershield.org")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> userService.createUser(request));
    }

    @Test
    @DisplayName("Get coordinators returns roster with workload metrics")
    void testGetCoordinatorsRoster() {
        User coord = User.builder()
                .id(2L)
                .publicId("coord-pub-id")
                .fullName("Coordinator One")
                .email("coord1@cybershield.org")
                .role(coordinatorRole)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        when(userRepository.findByRole_NameIn(anyList())).thenReturn(List.of(coord));
        when(assignmentRepository.countByInvestigatorId(2L)).thenReturn(5L);
        when(assignmentRepository.countByInvestigatorIdAndAssignmentStatus(2L, AssignmentStatus.ACTIVE)).thenReturn(3L);

        List<CoordinatorSummaryDto> list = userService.getCoordinators();

        assertEquals(1, list.size());
        assertEquals(3L, list.get(0).getActiveCasesCount());
        assertEquals(5L, list.get(0).getTotalAssignedCount());
        assertEquals(2L, list.get(0).getCompletedCount());
    }

    @Test
    @DisplayName("Admin cannot delete own account")
    void testDeleteOwnAccountThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(adminUser));
        when(userRepository.findByPublicId("admin-pub-id")).thenReturn(Optional.of(adminUser));

        assertThrows(IllegalArgumentException.class, () -> userService.deleteUser("admin-pub-id"));
    }
}
