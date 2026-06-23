package com.luxuryresort.application.dto.request;

import com.luxuryresort.domain.enums.UserRole;

import jakarta.validation.constraints.NotNull;

public record AdminUserRoleRequest(@NotNull UserRole role) {
}
