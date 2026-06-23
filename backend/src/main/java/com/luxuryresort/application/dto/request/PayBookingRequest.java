package com.luxuryresort.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PayBookingRequest(
        @NotBlank @Size(max = 50) String paymentMethod
) {
}
