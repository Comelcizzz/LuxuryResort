package com.luxuryresort.application.dto.response;

import com.luxuryresort.domain.enums.RoomStatus;
import com.luxuryresort.domain.enums.RoomType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record RoomResponse(
        UUID id,
        String name,
        String description,
        BigDecimal basePricePerNight,
        RoomType roomType,
        int maxOccupancy,
        BigDecimal sizeSqm,
        Integer floor,
        String roomNumber,
        RoomStatus status,
        List<String> amenities,
        List<String> images,
        BigDecimal avgRating,
        int reviewCount,
        Instant createdAt,
        Instant updatedAt,
        Instant deletedAt
) {
}
