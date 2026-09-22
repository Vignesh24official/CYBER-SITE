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
public class CoordinatorSummaryDto {
    private String publicId;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private AccountStatus accountStatus;
    private long activeCasesCount;
    private long totalAssignedCount;
    private long completedCount;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
}
