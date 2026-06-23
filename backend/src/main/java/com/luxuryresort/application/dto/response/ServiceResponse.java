package com.luxuryresort.application.dto.response;

import com.luxuryresort.domain.enums.ServiceCategory;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ServiceResponse(
        UUID id,
        String name,
        String description,
        ServiceCategory category,
        BigDecimal price,
        Integer durationMinutes,
        int maxParticipants,
        List<String> images,
        boolean available,
        BigDecimal popularityScore,
        Instant createdAt,
        Instant deletedAt
) {
}
