package com.luxuryresort.application.dto.request;

import com.luxuryresort.domain.enums.BookingStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateBookingStatusRequest(
        @NotNull BookingStatus status,
        String reason
) {
}
