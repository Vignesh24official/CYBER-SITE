package com.cybershield.service;

import com.cybershield.dto.auth.AuthResponse;
import com.cybershield.dto.auth.LoginRequest;
import com.cybershield.dto.auth.RegisterRequest;
import com.cybershield.entity.Role;
import com.cybershield.entity.User;
import com.cybershield.enums.AccountStatus;
import com.cybershield.enums.RoleName;
import com.cybershield.exception.DuplicateResourceException;

import com.cybershield.repository.RefreshTokenRepository;
import com.cybershield.repository.RoleRepository;
import com.cybershield.repository.UserRepository;
import com.cybershield.security.JwtTokenProvider;
import com.cybershield.security.UserPrincipal;
import com.cybershield.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private AuthServiceImpl authService;

    private Role userRole;
    private User testUser;
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        userRole = Role.builder().id(1L).name(RoleName.ROLE_USER).build();
        testUser = User.builder()
                .id(1L)
                .publicId("u-123")
                .fullName("John Doe")
                .email("john@example.com")
                .passwordHash("hashedPassword")
                .role(userRole)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        UserPrincipal principal = UserPrincipal.create(testUser);
        authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
    }

    @Test
    @DisplayName("Should successfully register a new user")
    void register_Success() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("John Doe")
                .email("john@example.com")
                .password("Password@123")
                .confirmPassword("Password@123")
                .build();

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(roleRepository.findByName(RoleName.ROLE_USER)).thenReturn(Optional.of(userRole));
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(tokenProvider.generateAccessToken(any())).thenReturn("mockAccessToken");
        when(tokenProvider.generateRefreshToken(any())).thenReturn("mockRefreshToken");
        when(tokenProvider.getRefreshTokenExpirationMs()).thenReturn(604800000L);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mockAccessToken", response.getAccessToken());
        assertEquals("mockRefreshToken", response.getRefreshToken());
        assertEquals("john@example.com", response.getUser().getEmail());

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException if email exists during registration")
    void register_DuplicateEmail_ThrowsException() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("John Doe")
                .email("john@example.com")
                .password("Password@123")
                .confirmPassword("Password@123")
                .build();

        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should login successfully with valid credentials")
    void login_Success() {
        LoginRequest request = LoginRequest.builder()
                .email("john@example.com")
                .password("Password@123")
                .build();

        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(tokenProvider.generateAccessToken(any())).thenReturn("mockAccessToken");
        when(tokenProvider.generateRefreshToken(any())).thenReturn("mockRefreshToken");
        when(tokenProvider.getRefreshTokenExpirationMs()).thenReturn(604800000L);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mockAccessToken", response.getAccessToken());
        assertEquals("john@example.com", response.getUser().getEmail());
    }

    @Test
    @DisplayName("Should successfully login existing Admin via Google Account")
    void googleAuth_ExistingAdmin_Success() {
        Role adminRole = Role.builder().id(3L).name(RoleName.ROLE_ADMIN).build();
        User adminUser = User.builder()
                .id(3L)
                .publicId("u-admin")
                .fullName("System Administrator")
                .email("admin@cybershield.org")
                .passwordHash("hashedPass")
                .role(adminRole)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        com.cybershield.dto.auth.GoogleAuthRequest request = com.cybershield.dto.auth.GoogleAuthRequest.builder()
                .email("admin@cybershield.org")
                .name("System Administrator")
                .isSignUp(false)
                .build();

        when(userRepository.findByEmail("admin@cybershield.org")).thenReturn(Optional.of(adminUser));
        when(userRepository.save(any(User.class))).thenReturn(adminUser);
        when(tokenProvider.generateAccessToken(any())).thenReturn("adminAccessToken");
        when(tokenProvider.generateRefreshToken(any())).thenReturn("adminRefreshToken");
        when(tokenProvider.getRefreshTokenExpirationMs()).thenReturn(604800000L);

        AuthResponse response = authService.googleAuth(request);

        assertNotNull(response);
        assertEquals("adminAccessToken", response.getAccessToken());
        assertEquals("ROLE_ADMIN", response.getUser().getRole());
        assertEquals("admin@cybershield.org", response.getUser().getEmail());
        verify(userRepository, times(1)).save(adminUser);
    }

    @Test
    @DisplayName("Should successfully login existing Investigator / Coordinator via Google Account")
    void googleAuth_ExistingInvestigator_Success() {
        Role investigatorRole = Role.builder().id(2L).name(RoleName.ROLE_INVESTIGATOR).build();
        User investigatorUser = User.builder()
                .id(2L)
                .publicId("u-investigator")
                .fullName("Lead Investigator")
                .email("investigator@cybershield.org")
                .passwordHash("hashedPass")
                .role(investigatorRole)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        com.cybershield.dto.auth.GoogleAuthRequest request = com.cybershield.dto.auth.GoogleAuthRequest.builder()
                .email("investigator@cybershield.org")
                .name("Lead Investigator")
                .isSignUp(false)
                .build();

        when(userRepository.findByEmail("investigator@cybershield.org")).thenReturn(Optional.of(investigatorUser));
        when(userRepository.save(any(User.class))).thenReturn(investigatorUser);
        when(tokenProvider.generateAccessToken(any())).thenReturn("investigatorAccessToken");
        when(tokenProvider.generateRefreshToken(any())).thenReturn("investigatorRefreshToken");
        when(tokenProvider.getRefreshTokenExpirationMs()).thenReturn(604800000L);

        AuthResponse response = authService.googleAuth(request);

        assertNotNull(response);
        assertEquals("investigatorAccessToken", response.getAccessToken());
        assertEquals("ROLE_INVESTIGATOR", response.getUser().getRole());
        assertEquals("investigator@cybershield.org", response.getUser().getEmail());
    }

    @Test
    @DisplayName("Should successfully register a new Citizen user via Google Sign-Up")
    void googleAuth_NewCitizen_SignUp_Success() {
        com.cybershield.dto.auth.GoogleAuthRequest request = com.cybershield.dto.auth.GoogleAuthRequest.builder()
                .email("newcitizen@gmail.com")
                .name("Jane Citizen")
                .isSignUp(true)
                .build();

        when(userRepository.findByEmail("newcitizen@gmail.com")).thenReturn(Optional.empty());
        when(roleRepository.findByName(RoleName.ROLE_USER)).thenReturn(Optional.of(userRole));
        when(passwordEncoder.encode(anyString())).thenReturn("hashedGooglePass");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(tokenProvider.generateAccessToken(any())).thenReturn("citizenAccessToken");
        when(tokenProvider.generateRefreshToken(any())).thenReturn("citizenRefreshToken");
        when(tokenProvider.getRefreshTokenExpirationMs()).thenReturn(604800000L);

        AuthResponse response = authService.googleAuth(request);

        assertNotNull(response);
        assertEquals("citizenAccessToken", response.getAccessToken());
        verify(userRepository, times(1)).save(any(User.class));
    }
}
