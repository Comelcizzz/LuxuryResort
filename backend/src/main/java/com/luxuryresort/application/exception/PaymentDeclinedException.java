package com.luxuryresort.application.exception;

import java.util.UUID;

public class PaymentDeclinedException extends RuntimeException {

    private final UUID paymentId;

    public PaymentDeclinedException(String message, UUID paymentId) {
        super(message);
        this.paymentId = paymentId;
    }

    public UUID getPaymentId() {
        return paymentId;
    }
}
