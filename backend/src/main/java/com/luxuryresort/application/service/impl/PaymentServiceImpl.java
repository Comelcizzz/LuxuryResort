package com.luxuryresort.application.service.impl;

import com.luxuryresort.application.dto.request.PayBookingRequest;
import com.luxuryresort.application.dto.response.PayBookingResponse;
import com.luxuryresort.application.exception.PaymentDeclinedException;
import com.luxuryresort.application.exception.ResourceNotFoundException;
import com.luxuryresort.application.mapper.PaymentMapper;
import com.luxuryresort.application.service.PaymentService;
import com.luxuryresort.domain.entity.Booking;
import com.luxuryresort.domain.entity.Payment;
import com.luxuryresort.domain.entity.User;
import com.luxuryresort.domain.enums.BookingStatus;
import com.luxuryresort.domain.enums.PaymentStatus;
import com.luxuryresort.domain.enums.UserRole;
import com.luxuryresort.domain.repository.BookingRepository;
import com.luxuryresort.domain.repository.PaymentRepository;
import com.luxuryresort.infrastructure.payment.PaymentGateway;
import com.luxuryresort.infrastructure.payment.PaymentResult;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentGateway paymentGateway;
    private final PaymentMapper paymentMapper;

    public PaymentServiceImpl(
            BookingRepository bookingRepository,
            PaymentRepository paymentRepository,
            PaymentGateway paymentGateway,
            PaymentMapper paymentMapper
    ) {
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.paymentGateway = paymentGateway;
        this.paymentMapper = paymentMapper;
    }

    @Override
    @Transactional
    public PayBookingResponse payBooking(UUID bookingId, PayBookingRequest request, User actor) {
        Booking booking = bookingRepository.findWithRoomAndUserById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        assertCanPay(booking, actor);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only pending bookings can be paid");
        }
        if (paymentRepository.existsByBooking_IdAndStatus(bookingId, PaymentStatus.COMPLETED)) {
            throw new IllegalArgumentException("Booking already has a completed payment");
        }
        BigDecimal amount = booking.getDynamicPriceTotal();
        PaymentResult result = paymentGateway.processPayment(bookingId, amount, request.paymentMethod());
        Instant now = Instant.now();
        Payment payment = Payment.builder()
                .booking(booking)
                .amount(amount)
                .currency("UAH")
                .status(result.success() ? PaymentStatus.COMPLETED : PaymentStatus.FAILED)
                .paymentMethod(request.paymentMethod())
                .transactionRef(result.success() ? result.transactionRef() : null)
                .failureReason(result.success() ? null : result.failureMessage())
                .processedAt(now)
                .createdAt(now)
                .build();
        payment = paymentRepository.save(payment);
        if (result.success()) {
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setUpdatedAt(now);
            bookingRepository.save(booking);
            return new PayBookingResponse(booking.getStatus(), paymentMapper.toResponse(payment));
        }
        throw new PaymentDeclinedException(result.failureMessage(), payment.getId());
    }

    private static void assertCanPay(Booking booking, User actor) {
        if (actor.getRole() == UserRole.GUEST && !booking.getUser().getId().equals(actor.getId())) {
            throw new AccessDeniedException("Cannot pay for another user's booking");
        }
    }
}
