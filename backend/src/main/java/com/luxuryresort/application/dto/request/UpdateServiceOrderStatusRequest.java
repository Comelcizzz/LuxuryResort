package com.luxuryresort.application.dto.request;

import com.luxuryresort.domain.enums.OrderStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateServiceOrderStatusRequest(@NotNull OrderStatus status) {
}
