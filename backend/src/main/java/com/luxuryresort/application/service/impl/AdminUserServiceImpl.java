package com.luxuryresort.application.service.impl;

import com.luxuryresort.application.dto.request.AdminUserRoleRequest;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.application.dto.response.UserResponse;
import com.luxuryresort.application.exception.ResourceNotFoundException;
import com.luxuryresort.application.mapper.UserMapper;
import com.luxuryresort.application.service.AdminUserService;
import com.luxuryresort.domain.entity.User;
import com.luxuryresort.domain.enums.UserRole;
import com.luxuryresort.domain.repository.UserRepository;
import com.luxuryresort.domain.repository.UserSpecs;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public AdminUserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> list(String q, UserRole role, Boolean active, Pageable pageable) {
        return PageResponse.from(
                userRepository.findAll(UserSpecs.searchFilter(q, role, active), pageable)
                        .map(userMapper::toResponse)
        );
    }

    @Override
    @Transactional
    public UserResponse updateRole(UUID userId, AdminUserRoleRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(request.role());
        return userMapper.toResponse(userRepository.save(user));
    }
}
