package com.luxuryresort.application.service;

import com.luxuryresort.application.dto.request.AdminUserRoleRequest;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.application.dto.response.UserResponse;
import com.luxuryresort.domain.enums.UserRole;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface AdminUserService {

    PageResponse<UserResponse> list(String q, UserRole role, Boolean active, Pageable pageable);

    UserResponse updateRole(UUID userId, AdminUserRoleRequest request);
}
