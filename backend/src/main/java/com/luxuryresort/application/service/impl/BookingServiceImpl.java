package com.luxuryresort.application.service.impl;

import com.luxuryresort.application.dto.request.CreateBookingRequest;
import com.luxuryresort.application.dto.request.UpdateBookingStatusRequest;
import com.luxuryresort.application.dto.response.AppliedRuleDto;
import com.luxuryresort.application.dto.response.BookingResponse;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.application.dto.response.PricingResult;
import com.luxuryresort.application.dto.response.RoomAvailabilityResponse;
import com.luxuryresort.application.exception.BookingConflictException;
import com.luxuryresort.application.exception.ResourceNotFoundException;
import com.luxuryresort.application.mapper.BookingMapper;
import com.luxuryresort.application.service.BookingService;
import com.luxuryresort.application.service.DynamicPricingService;
import com.luxuryresort.application.service.RoomService;
import com.luxuryresort.domain.entity.Booking;
import com.luxuryresort.domain.entity.Room;
import com.luxuryresort.domain.entity.User;
import com.luxuryresort.domain.enums.BookingStatus;
import com.luxuryresort.domain.enums.UserRole;
import com.luxuryresort.domain.repository.BookingRepository;
import com.luxuryresort.domain.repository.BookingSpecs;
import com.luxuryresort.domain.repository.RoomRepository;
import com.luxuryresort.domain.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final DynamicPricingService dynamicPricingService;
    private final RoomService roomService;
    private final BookingMapper bookingMapper;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            RoomRepository roomRepository,
            UserRepository userRepository,
            DynamicPricingService dynamicPricingService,
            RoomService roomService,
            BookingMapper bookingMapper
    ) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.dynamicPricingService = dynamicPricingService;
        this.roomService = roomService;
        this.bookingMapper = bookingMapper;
    }

    @Override
    @Transactional
    public BookingResponse create(CreateBookingRequest request, User actor) {
        if (!request.hasValidDateRange()) {
            throw new IllegalArgumentException("checkOut must be after checkIn");
        }
        Room room = roomRepository.findByIdAndDeletedAtIsNull(request.roomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        if (request.guests() > room.getMaxOccupancy()) {
            throw new IllegalArgumentException("guests exceeds room max occupancy");
        }
        RoomAvailabilityResponse availability = roomService.availability(request.roomId(), request.checkIn(), request.checkOut());
        if (!availability.available()) {
            throw new BookingConflictException("Room is not available for the selected dates");
        }
        User user = userRepository.findById(actor.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        PricingResult pricing = dynamicPricingService.calculateDynamicPrice(
                request.roomId(),
                request.checkIn(),
                request.checkOut(),
                0
        );

        Map<String, Object> snapshot = new HashMap<>(dynamicPricingService.toSnapshot(pricing));
        Instant now = Instant.now();
        Booking booking = Booking.builder()
                .room(room)
                .user(user)
                .checkInDate(request.checkIn())
                .checkOutDate(request.checkOut())
                .guestsCount(request.guests())
                .baseTotal(pricing.baseTotal())
                .dynamicPriceTotal(pricing.finalTotal())
                .finalMultiplier(pricing.combinedMultiplier())
                .pricingSnapshot(snapshot)
                .status(BookingStatus.PENDING)
                .specialRequests(request.specialRequests())
                .loyaltyPointsEarned(0)
                .loyaltyPointsUsed(0)
                .createdAt(now)
                .updatedAt(now)
                .build();
        try {
            bookingRepository.saveAndFlush(booking);
        } catch (DataIntegrityViolationException e) {
            throw new BookingConflictException("Room is not available for the selected dates");
        }
        return bookingMapper.toResponse(booking, pricing);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<BookingResponse> list(
            User actor,
            BookingStatus status,
            Instant from,
            Instant to,
            LocalDate checkInFrom,
            LocalDate checkInTo,
            String q,
            Pageable pageable
    ) {
        Page<Booking> page;
        if (actor.getRole() == UserRole.GUEST) {
            page = bookingRepository.findAll(
                    BookingSpecs.listFilter(actor.getId(), status, from, to, checkInFrom, checkInTo, q, false),
                    pageable
            );
        } else {
            page = bookingRepository.findAll(
                    BookingSpecs.listFilter(null, status, from, to, checkInFrom, checkInTo, q, true),
                    pageable
            );
        }
        return PageResponse.from(page.map(bookingMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getById(UUID id, User actor) {
        Booking booking = bookingRepository.findWithRoomAndUserById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        assertCanView(booking, actor);
        PricingResult pricing = pricingFromSnapshot(booking.getPricingSnapshot());
        return bookingMapper.toResponse(booking, pricing);
    }

    @Override
    @Transactional
    public BookingResponse updateStatus(UUID id, UpdateBookingStatusRequest request, User actor) {
        Booking booking = bookingRepository.findWithRoomAndUserById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (actor.getRole() == UserRole.GUEST) {
            if (!booking.getUser().getId().equals(actor.getId())) {
                throw new AccessDeniedException("Cannot modify another user's booking");
            }
            assertGuestStatusChange(booking.getStatus(), request.status());
        }
        BookingStatus old = booking.getStatus();
        BookingStatus next = request.status();
        if (old == next) {
            return bookingMapper.toResponse(booking, pricingFromSnapshot(booking.getPricingSnapshot()));
        }
        if (actor.getRole() != UserRole.GUEST) {
            validateTransition(old, next);
        }
        booking.setStatus(next);
        booking.setUpdatedAt(Instant.now());
        if (next == BookingStatus.CANCELLED || next == BookingStatus.NO_SHOW) {
            booking.setCancellationReason(request.reason());
        }
        bookingRepository.save(booking);
        return bookingMapper.toResponse(booking, pricingFromSnapshot(booking.getPricingSnapshot()));
    }

    @Override
    @Transactional
    public void deleteById(UUID id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        bookingRepository.delete(booking);
    }

    private static void assertCanView(Booking booking, User actor) {
        if (actor.getRole() == UserRole.GUEST && !booking.getUser().getId().equals(actor.getId())) {
            throw new AccessDeniedException("Cannot access another user's booking");
        }
    }

    /**
     * RBAC promt: гість може скасувати власне бронювання — лише перехід у {@link BookingStatus#CANCELLED}.
     */
    private static void assertGuestStatusChange(BookingStatus current, BookingStatus requested) {
        if (requested != BookingStatus.CANCELLED) {
            throw new AccessDeniedException("Guests may only cancel a booking (set status to CANCELLED)");
        }
        if (current != BookingStatus.PENDING && current != BookingStatus.CONFIRMED) {
            throw new IllegalArgumentException("Booking cannot be cancelled in the current state");
        }
    }

    private static void validateTransition(BookingStatus from, BookingStatus to) {
        Set<BookingStatus> allowed = switch (from) {
            case PENDING -> EnumSet.of(BookingStatus.CONFIRMED, BookingStatus.CANCELLED, BookingStatus.NO_SHOW);
            case CONFIRMED -> EnumSet.of(BookingStatus.CHECKED_IN, BookingStatus.CANCELLED, BookingStatus.NO_SHOW);
            case CHECKED_IN -> EnumSet.of(BookingStatus.CHECKED_OUT, BookingStatus.NO_SHOW, BookingStatus.CANCELLED);
            case CHECKED_OUT, CANCELLED, NO_SHOW -> EnumSet.noneOf(BookingStatus.class);
        };
        if (!allowed.contains(to)) {
            throw new IllegalArgumentException("Invalid booking status transition: " + from + " -> " + to);
        }
    }

    private static PricingResult pricingFromSnapshot(Map<String, Object> snap) {
        if (snap == null || snap.isEmpty()) {
            return null;
        }
        BigDecimal baseTotal = toBigDecimal(snap.get("baseTotal"));
        BigDecimal finalTotal = toBigDecimal(snap.get("finalTotal"));
        BigDecimal combinedMultiplier = toBigDecimal(snap.get("combinedMultiplier"));
        BigDecimal loyaltyDiscount = toBigDecimal(snap.get("loyaltyDiscount"));
        int pointsEarned = toInt(snap.get("pointsEarned"));
        List<AppliedRuleDto> applied = new ArrayList<>();
        Object rawRules = snap.get("appliedRules");
        if (rawRules instanceof List<?> list) {
            for (Object o : list) {
                if (o instanceof Map<?, ?> m) {
                    String name = Objects.toString(m.get("name"), "");
                    applied.add(new AppliedRuleDto(name, toBigDecimal(m.get("multiplier"))));
                }
            }
        }
        return new PricingResult(baseTotal, finalTotal, combinedMultiplier, loyaltyDiscount, List.copyOf(applied), pointsEarned);
    }

    private static BigDecimal toBigDecimal(Object v) {
        if (v == null) {
            return BigDecimal.ZERO;
        }
        if (v instanceof BigDecimal bd) {
            return bd;
        }
        if (v instanceof Number n) {
            return BigDecimal.valueOf(n.doubleValue());
        }
        return new BigDecimal(v.toString());
    }

    private static int toInt(Object v) {
        if (v instanceof Number n) {
            return n.intValue();
        }
        return 0;
    }
}
