package com.luxuryresort.application.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ReviewResponse(
        UUID id,
        UUID roomId,
        UUID userId,
        String authorName,
        UUID bookingId,
        int rating,
        String comment,
        List<String> images,
        BigDecimal sentimentScore,
        boolean approved,
        Instant createdAt
) {
}
