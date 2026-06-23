package com.luxuryresort.application.dto.response;

import com.luxuryresort.domain.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record BookingResponse(
        UUID id,
        UUID roomId,
        String roomNumber,
        String roomName,
        UUID userId,
        String userEmail,
        LocalDate checkInDate,
        LocalDate checkOutDate,
        int guestsCount,
        BigDecimal baseTotal,
        BigDecimal dynamicPriceTotal,
        BigDecimal finalMultiplier,
        BookingStatus status,
        String cancellationReason,
        String specialRequests,
        int loyaltyPointsEarned,
        int loyaltyPointsUsed,
        Instant createdAt,
        Instant updatedAt,
        PricingResult pricing
) {
}
