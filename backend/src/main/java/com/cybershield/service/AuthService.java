package com.cybershield.service;

import com.cybershield.dto.auth.*;
import com.cybershield.dto.user.UserDto;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse googleAuth(GoogleAuthRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
    void logout(String refreshToken);
    UserDto getCurrentUserDto();
    UserDto updateProfile(ProfileUpdateRequest request);
    void changePassword(PasswordChangeRequest request);
}
