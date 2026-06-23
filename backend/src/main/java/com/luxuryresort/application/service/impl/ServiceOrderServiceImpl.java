package com.luxuryresort.application.service.impl;

import com.luxuryresort.application.dto.request.CreateServiceOrderRequest;
import com.luxuryresort.application.dto.request.UpdateServiceOrderStatusRequest;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.application.dto.response.ServiceOrderResponse;
import com.luxuryresort.application.exception.ResourceNotFoundException;
import com.luxuryresort.application.mapper.ServiceOrderMapper;
import com.luxuryresort.application.security.UserPermissions;
import com.luxuryresort.application.service.ServiceOrderService;
import com.luxuryresort.domain.entity.Booking;
import com.luxuryresort.domain.entity.ServiceEntity;
import com.luxuryresort.domain.entity.ServiceOrder;
import com.luxuryresort.domain.entity.User;
import com.luxuryresort.domain.enums.BookingStatus;
import com.luxuryresort.domain.enums.OrderStatus;
import com.luxuryresort.domain.repository.BookingRepository;
import com.luxuryresort.domain.repository.ServiceEntityRepository;
import com.luxuryresort.domain.repository.ServiceOrderRepository;
import com.luxuryresort.domain.repository.ServiceOrderSpecs;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.util.EnumSet;
import java.util.UUID;

@Service
public class ServiceOrderServiceImpl implements ServiceOrderService {

    private static final EnumSet<BookingStatus> BOOKING_OK_FOR_SERVICE = EnumSet.of(
            BookingStatus.CONFIRMED,
            BookingStatus.CHECKED_IN,
            BookingStatus.CHECKED_OUT
    );

    private final ServiceOrderRepository serviceOrderRepository;
    private final ServiceEntityRepository serviceEntityRepository;
    private final BookingRepository bookingRepository;
    private final ServiceOrderMapper serviceOrderMapper;
    private final Clock clock;

    public ServiceOrderServiceImpl(
            ServiceOrderRepository serviceOrderRepository,
            ServiceEntityRepository serviceEntityRepository,
            BookingRepository bookingRepository,
            ServiceOrderMapper serviceOrderMapper,
            Clock clock
    ) {
        this.serviceOrderRepository = serviceOrderRepository;
        this.serviceEntityRepository = serviceEntityRepository;
        this.bookingRepository = bookingRepository;
        this.serviceOrderMapper = serviceOrderMapper;
        this.clock = clock;
    }

    @Override
    @Transactional
    public ServiceOrderResponse create(CreateServiceOrderRequest request, User actor) {
        ServiceEntity service = serviceEntityRepository.findByIdAndDeletedAtIsNull(request.serviceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        if (!service.isAvailable()) {
            throw new IllegalArgumentException("Service is not available");
        }
        int qty = request.quantity() > 0 ? request.quantity() : 1;
        Booking booking = null;
        if (request.bookingId() != null) {
            booking = bookingRepository.findWithRoomAndUserById(request.bookingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
            if (!booking.getUser().getId().equals(actor.getId()) && !UserPermissions.isStaff(actor)) {
                throw new IllegalArgumentException("Booking does not belong to the current user");
            }
            if (!BOOKING_OK_FOR_SERVICE.contains(booking.getStatus())) {
                throw new IllegalArgumentException("Booking status does not allow service orders");
            }
        }
        Instant now = clock.instant();
        BigDecimal total = service.getPrice().multiply(BigDecimal.valueOf(qty));
        ServiceOrder order = ServiceOrder.builder()
                .service(service)
                .user(actor)
                .booking(booking)
                .appointmentDatetime(request.appointmentDatetime())
                .quantity(qty)
                .totalPrice(total)
                .status(OrderStatus.PENDING)
                .specialRequests(request.specialRequests())
                .createdAt(now)
                .build();
        return serviceOrderMapper.toResponse(serviceOrderRepository.save(order));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ServiceOrderResponse> list(
            User actor,
            OrderStatus status,
            Instant from,
            Instant to,
            String q,
            Pageable pageable
    ) {
        if (UserPermissions.isStaff(actor)) {
            return PageResponse.from(
                    serviceOrderRepository.findAll(
                                    ServiceOrderSpecs.listFilter(null, status, from, to, q, true),
                                    pageable
                            )
                            .map(serviceOrderMapper::toResponse)
            );
        }
        return PageResponse.from(
                serviceOrderRepository.findAll(
                                ServiceOrderSpecs.listFilter(actor.getId(), status, from, to, q, false),
                                pageable
                        )
                        .map(serviceOrderMapper::toResponse)
        );
    }

    @Override
    @Transactional
    public ServiceOrderResponse updateStatus(UUID id, UpdateServiceOrderStatusRequest request, User actor) {
        if (!UserPermissions.isStaff(actor)) {
            throw new IllegalArgumentException("Only staff can change service order status");
        }
        ServiceOrder order = serviceOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service order not found"));
        OrderStatus next = request.status();
        validateTransition(order.getStatus(), next);
        order.setStatus(next);
        return serviceOrderMapper.toResponse(serviceOrderRepository.save(order));
    }

    private static void validateTransition(OrderStatus current, OrderStatus next) {
        if (current == next) {
            return;
        }
        switch (current) {
            case PENDING -> {
                if (next != OrderStatus.CONFIRMED && next != OrderStatus.CANCELLED) {
                    throw new IllegalArgumentException("Invalid status transition");
                }
            }
            case CONFIRMED -> {
                if (next != OrderStatus.IN_PROGRESS && next != OrderStatus.CANCELLED) {
                    throw new IllegalArgumentException("Invalid status transition");
                }
            }
            case IN_PROGRESS -> {
                if (next != OrderStatus.COMPLETED && next != OrderStatus.CANCELLED) {
                    throw new IllegalArgumentException("Invalid status transition");
                }
            }
            case COMPLETED, CANCELLED -> throw new IllegalArgumentException("Terminal service order status");
        }
    }
}
