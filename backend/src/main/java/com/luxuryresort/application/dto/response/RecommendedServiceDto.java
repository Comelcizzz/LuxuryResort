package com.luxuryresort.application.dto.response;

import com.luxuryresort.domain.enums.ServiceCategory;

import java.math.BigDecimal;
import java.util.UUID;

public record RecommendedServiceDto(
        UUID id,
        String name,
        ServiceCategory category,
        BigDecimal price,
        BigDecimal relevanceScore
) {
}
