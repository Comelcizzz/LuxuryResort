package com.luxuryresort.application.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record CreateBookingRequest(
        @NotNull UUID roomId,
        @NotNull LocalDate checkIn,
        @NotNull LocalDate checkOut,
        @Min(1) @Max(20) int guests,
        @Min(0) int loyaltyPointsToUse,
        String specialRequests
) {
    public boolean hasValidDateRange() {
        return checkIn != null && checkOut != null && checkOut.isAfter(checkIn);
    }
}
