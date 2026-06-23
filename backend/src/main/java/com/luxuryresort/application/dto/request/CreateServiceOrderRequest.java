package com.luxuryresort.application.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.UUID;

public record CreateServiceOrderRequest(
        @NotNull UUID serviceId,
        UUID bookingId,
        @NotNull Instant appointmentDatetime,
        @Min(1) int quantity,
        @Size(max = 2000) String specialRequests
) {
}
