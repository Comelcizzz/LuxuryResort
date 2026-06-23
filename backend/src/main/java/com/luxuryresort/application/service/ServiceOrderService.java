package com.luxuryresort.application.service;

import com.luxuryresort.application.dto.request.CreateServiceOrderRequest;
import com.luxuryresort.application.dto.request.UpdateServiceOrderStatusRequest;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.application.dto.response.ServiceOrderResponse;
import com.luxuryresort.domain.entity.User;
import com.luxuryresort.domain.enums.OrderStatus;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.UUID;

public interface ServiceOrderService {

    ServiceOrderResponse create(CreateServiceOrderRequest request, User actor);

    PageResponse<ServiceOrderResponse> list(
            User actor,
            OrderStatus status,
            Instant from,
            Instant to,
            String q,
            Pageable pageable
    );

    ServiceOrderResponse updateStatus(UUID id, UpdateServiceOrderStatusRequest request, User actor);
}
