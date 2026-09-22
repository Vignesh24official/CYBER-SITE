package com.cybershield.service;

import com.cybershield.dto.common.PageResponse;
import com.cybershield.dto.user.AdminUserCreateRequest;
import com.cybershield.dto.user.AdminUserUpdateRequest;
import com.cybershield.dto.user.CoordinatorSummaryDto;
import com.cybershield.dto.user.UserDto;
import com.cybershield.enums.AccountStatus;
import com.cybershield.enums.RoleName;

import java.util.List;
import java.util.Map;

public interface UserService {
    PageResponse<UserDto> getUsers(String search, RoleName roleName, AccountStatus status, int page, int size, String sortBy, String sortDir);
    List<UserDto> getInvestigators();
    List<CoordinatorSummaryDto> getCoordinators();
    UserDto createUser(AdminUserCreateRequest request);
    UserDto updateUser(String publicId, AdminUserUpdateRequest request);
    UserDto updateUserStatus(String publicId, AccountStatus status);
    UserDto updateUserRole(String publicId, RoleName roleName);
    void deleteUser(String publicId);
    void resetPassword(String publicId, String newPassword);
    Map<String, Object> getUserStatistics();
}
