package com.luxuryresort.infrastructure.payment;

public record PaymentResult(boolean success, String transactionRef, String failureMessage) {

    public static PaymentResult success(String transactionRef) {
        return new PaymentResult(true, transactionRef, null);
    }

    public static PaymentResult failure(String failureMessage) {
        return new PaymentResult(false, null, failureMessage);
    }
}
