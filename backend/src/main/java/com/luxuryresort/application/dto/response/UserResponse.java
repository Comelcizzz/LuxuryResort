package com.luxuryresort.application.dto.response;

import com.luxuryresort.domain.enums.UserRole;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String phone,
        UserRole role,
        boolean active,
        int loyaltyPoints,
        Instant createdAt,
        Instant updatedAt
) {
}
