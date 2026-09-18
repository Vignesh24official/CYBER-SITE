package com.cybershield.service;

import com.cybershield.dto.common.PageResponse;
import com.cybershield.dto.user.UserDto;
import com.cybershield.enums.AccountStatus;
import com.cybershield.enums.RoleName;

import java.util.List;

public interface UserService {
    PageResponse<UserDto> getUsers(RoleName roleName, int page, int size);
    List<UserDto> getInvestigators();
    UserDto updateUserStatus(String publicId, AccountStatus status);
    UserDto updateUserRole(String publicId, RoleName roleName);
}
