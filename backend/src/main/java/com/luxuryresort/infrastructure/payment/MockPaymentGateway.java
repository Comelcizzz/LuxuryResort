package com.luxuryresort.infrastructure.payment;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class MockPaymentGateway implements PaymentGateway {

    /** 1.0 = always approve (stable demos); lower values simulate declines. */
    private final double successProbability;

    public MockPaymentGateway(
            @Value("${luxuryresort.payment.mock-success-probability:1.0}") double successProbability
    ) {
        this.successProbability = Math.clamp(successProbability, 0.0, 1.0);
    }

    @Override
    public PaymentResult processPayment(UUID bookingId, BigDecimal amount, String paymentMethod) {
        Objects.requireNonNull(bookingId);
        Objects.requireNonNull(amount);
        Objects.requireNonNull(paymentMethod);
        try {
            Thread.sleep(800);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Payment interrupted", e);
        }
        boolean success = ThreadLocalRandom.current().nextDouble() < successProbability;
        if (success) {
            String ref = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            return PaymentResult.success(ref);
        }
        return PaymentResult.failure("Недостатньо коштів (симуляція еквайрингу)");
    }
}
