package com.luxuryresort.infrastructure.payment;

import java.math.BigDecimal;
import java.util.UUID;

public interface PaymentGateway {

    PaymentResult processPayment(UUID bookingId, BigDecimal amount, String paymentMethod);
}
