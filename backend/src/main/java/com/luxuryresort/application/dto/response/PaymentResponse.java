package com.luxuryresort.application.dto.response;

import com.luxuryresort.domain.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PaymentResponse(
        UUID id,
        UUID bookingId,
        BigDecimal amount,
        String currency,
        PaymentStatus status,
        String paymentMethod,
        String transactionRef,
        String failureReason,
        Instant processedAt,
        Instant createdAt
) {
}
