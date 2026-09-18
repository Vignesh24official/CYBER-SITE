package com.cybershield.dto.user;

import com.cybershield.enums.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String publicId;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private AccountStatus accountStatus;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
}
