package com.luxuryresort.web.controller;

import com.luxuryresort.application.dto.request.CreateServiceOrderRequest;
import com.luxuryresort.application.dto.request.UpdateServiceOrderStatusRequest;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.application.dto.response.ServiceOrderResponse;
import com.luxuryresort.application.exception.ResourceNotFoundException;
import com.luxuryresort.application.service.ServiceOrderService;
import com.luxuryresort.domain.entity.User;
import com.luxuryresort.domain.enums.OrderStatus;
import com.luxuryresort.domain.repository.UserRepository;
import com.luxuryresort.web.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/api/service-orders")
public class ServiceOrderController {

    private final ServiceOrderService serviceOrderService;
    private final UserRepository userRepository;

    public ServiceOrderController(ServiceOrderService serviceOrderService, UserRepository userRepository) {
        this.serviceOrderService = serviceOrderService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ServiceOrderResponse>> create(
            Authentication authentication,
            @Valid @RequestBody CreateServiceOrderRequest request
    ) {
        User actor = requireUser(authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(serviceOrderService.create(request, actor)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ServiceOrderResponse>>> list(
            Authentication authentication,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) Instant from,
            @RequestParam(required = false) Instant to,
            @RequestParam(required = false) String q,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        User actor = requireUser(authentication);
        return ResponseEntity.ok(ApiResponse.ok(serviceOrderService.list(actor, status, from, to, q, pageable)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ServiceOrderResponse>> updateStatus(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateServiceOrderStatusRequest request
    ) {
        User actor = requireUser(authentication);
        return ResponseEntity.ok(ApiResponse.ok(serviceOrderService.updateStatus(id, request, actor)));
    }

    private User requireUser(Authentication authentication) {
        return userRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
