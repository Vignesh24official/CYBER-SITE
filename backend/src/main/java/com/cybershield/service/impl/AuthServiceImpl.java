package com.cybershield.service.impl;

import com.cybershield.dto.auth.*;
import com.cybershield.dto.user.UserDto;
import com.cybershield.entity.RefreshToken;
import com.cybershield.entity.Role;
import com.cybershield.entity.User;
import com.cybershield.enums.AccountStatus;
import com.cybershield.enums.AuditAction;
import com.cybershield.enums.RoleName;
import com.cybershield.exception.DuplicateResourceException;
import com.cybershield.exception.ResourceNotFoundException;
import com.cybershield.exception.UnauthorizedAccessException;
import com.cybershield.repository.RefreshTokenRepository;
import com.cybershield.repository.RoleRepository;
import com.cybershield.repository.UserRepository;
import com.cybershield.security.JwtTokenProvider;
import com.cybershield.security.SecurityUtils;
import com.cybershield.security.UserPrincipal;
import com.cybershield.service.AuditLogService;
import com.cybershield.service.AuthService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email address is already registered");
        }

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new ResourceNotFoundException("Default user role not found"));

        User user = User.builder()
                .publicId(UUID.randomUUID().toString())
                .fullName(request.getFullName())
                .email(request.getEmail().toLowerCase().trim())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        auditLogService.logAction(savedUser, AuditAction.USER_CREATED, "USER", savedUser.getPublicId(), "Registered new user account");

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        return buildAuthResponse(authentication, savedUser);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
            );

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            user.setLastLoginAt(LocalDateTime.now());
            user.setFailedLoginAttempts(0);
            userRepository.save(user);

            auditLogService.logAction(user, AuditAction.LOGIN, "USER", user.getPublicId(), "User successfully logged in");

            return buildAuthResponse(authentication, user);
        } catch (BadCredentialsException ex) {
            userRepository.findByEmail(request.getEmail().toLowerCase().trim()).ifPresent(user -> {
                user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
                if (user.getFailedLoginAttempts() >= 5) {
                    user.setAccountStatus(AccountStatus.LOCKED);
                    user.setLockTime(LocalDateTime.now());
                }
                userRepository.save(user);
                auditLogService.logAction(user, AuditAction.FAILED_LOGIN, "USER", user.getPublicId(), "Failed login attempt");
            });
            throw ex;
        }
    }

    @Override
    @Transactional
    public AuthResponse googleAuth(GoogleAuthRequest request) {
        String email = request.getEmail();
        String name = request.getName();
        String picture = request.getPicture();

        // If Google JWT credential was provided, extract claims from it
        if (request.getCredential() != null && !request.getCredential().isBlank()) {
            try {
                String[] parts = request.getCredential().split("\\.");
                if (parts.length >= 2) {
                    String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
                    JsonNode node = objectMapper.readTree(payloadJson);
                    if (node.has("email") && (email == null || email.isBlank())) {
                        email = node.get("email").asText();
                    }
                    if (node.has("name") && (name == null || name.isBlank())) {
                        name = node.get("name").asText();
                    }
                    if (node.has("picture") && (picture == null || picture.isBlank())) {
                        picture = node.get("picture").asText();
                    }
                }
            } catch (Exception e) {
                log.warn("Failed to parse Google credential token payload: {}", e.getMessage());
            }
        }

        if (email == null || email.trim().isBlank()) {
            throw new IllegalArgumentException("Valid Google email address is required for authentication");
        }

        email = email.toLowerCase().trim();
        Optional<User> existingUserOpt = userRepository.findByEmail(email);

        User user;
        if (existingUserOpt.isPresent()) {
            // Existing user (can be ROLE_ADMIN, ROLE_INVESTIGATOR, ROLE_COORDINATOR, or ROLE_USER)
            user = existingUserOpt.get();

            if (user.getAccountStatus() == AccountStatus.LOCKED || user.getAccountStatus() == AccountStatus.SUSPENDED) {
                throw new UnauthorizedAccessException("Account is " + user.getAccountStatus() + ". Please contact administrator.");
            }

            user.setLastLoginAt(LocalDateTime.now());
            user.setFailedLoginAttempts(0);
            userRepository.save(user);

            auditLogService.logAction(user, AuditAction.LOGIN, "USER", user.getPublicId(),
                    "Google Single Sign-On successful for role: " + user.getRole().getName());
        } else {
            // New citizen registration via Google Sign-Up
            // Security safeguard: only ROLE_USER can be self-registered via Google OAuth
            Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                    .orElseThrow(() -> new ResourceNotFoundException("Default citizen role not found"));

            String userFullName = (name != null && !name.isBlank()) ? name.trim() : email.split("@")[0];

            user = User.builder()
                    .publicId(UUID.randomUUID().toString())
                    .fullName(userFullName)
                    .email(email)
                    .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role(userRole)
                    .accountStatus(AccountStatus.ACTIVE)
                    .failedLoginAttempts(0)
                    .build();

            user = userRepository.save(user);

            auditLogService.logAction(user, AuditAction.USER_CREATED, "USER", user.getPublicId(),
                    "New citizen account registered via Google Sign-Up");
        }

        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userPrincipal, null, userPrincipal.getAuthorities());

        return buildAuthResponse(authentication, user);
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshTokenStr = request.getRefreshToken();
        if (!tokenProvider.validateToken(refreshTokenStr)) {
            throw new UnauthorizedAccessException("Invalid or expired refresh token");
        }

        String email = tokenProvider.getEmailFromToken(refreshTokenStr);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String tokenHash = hashToken(refreshTokenStr);
        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new UnauthorizedAccessException("Refresh token has been revoked or is invalid"));

        if (storedToken.getRevoked() || storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new UnauthorizedAccessException("Refresh token has expired or been revoked");
        }

        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userPrincipal, null, userPrincipal.getAuthorities());

        String newAccessToken = tokenProvider.generateAccessToken(authentication);
        String newRefreshToken = tokenProvider.generateRefreshToken(userPrincipal);

        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        saveRefreshToken(user, newRefreshToken);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .user(mapToUserDto(user))
                .build();
    }

    @Override
    @Transactional
    public void logout(String refreshTokenStr) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        User user = userRepository.findById(currentUser.getId()).orElse(null);

        if (refreshTokenStr != null && !refreshTokenStr.isBlank()) {
            String hash = hashToken(refreshTokenStr);
            refreshTokenRepository.findByTokenHash(hash).ifPresent(token -> {
                token.setRevoked(true);
                refreshTokenRepository.save(token);
            });
        }

        if (user != null) {
            auditLogService.logAction(user, AuditAction.LOGOUT, "USER", user.getPublicId(), "User logged out");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getCurrentUserDto() {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserDto(user);
    }

    @Override
    @Transactional
    public UserDto updateProfile(ProfileUpdateRequest request) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone());
        User saved = userRepository.save(user);

        auditLogService.logAction(user, AuditAction.USER_UPDATED, "USER", user.getPublicId(), "User updated profile information");

        return mapToUserDto(saved);
    }

    @Override
    @Transactional
    public void changePassword(PasswordChangeRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("New passwords do not match");
        }

        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Incorrect current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        refreshTokenRepository.deleteByUser(user);

        auditLogService.logAction(user, AuditAction.USER_UPDATED, "USER", user.getPublicId(), "Password changed successfully");
    }

    private AuthResponse buildAuthResponse(Authentication authentication, User user) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(userPrincipal);

        saveRefreshToken(user, refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(mapToUserDto(user))
                .build();
    }

    private void saveRefreshToken(User user, String tokenStr) {
        long expiryMs = tokenProvider.getRefreshTokenExpirationMs();
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(hashToken(tokenStr))
                .expiresAt(LocalDateTime.now().plusNanos(expiryMs * 1_000_000))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
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
