package com.luxuryresort.application.dto.response;

import com.luxuryresort.domain.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ServiceOrderResponse(
        UUID id,
        UUID serviceId,
        String serviceName,
        UUID userId,
        UUID bookingId,
        Instant appointmentDatetime,
        int quantity,
        BigDecimal totalPrice,
        OrderStatus status,
        String specialRequests,
        Instant createdAt
) {
}
