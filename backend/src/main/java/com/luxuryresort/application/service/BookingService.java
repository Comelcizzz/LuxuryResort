package com.luxuryresort.application.service;

import com.luxuryresort.application.dto.request.CreateBookingRequest;
import com.luxuryresort.application.dto.request.UpdateBookingStatusRequest;
import com.luxuryresort.application.dto.response.BookingResponse;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.domain.entity.User;
import com.luxuryresort.domain.enums.BookingStatus;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public interface BookingService {

    BookingResponse create(CreateBookingRequest request, User actor);

    PageResponse<BookingResponse> list(
            User actor,
            BookingStatus status,
            Instant from,
            Instant to,
            LocalDate checkInFrom,
            LocalDate checkInTo,
            String q,
            Pageable pageable
    );

    BookingResponse getById(UUID id, User actor);

    BookingResponse updateStatus(UUID id, UpdateBookingStatusRequest request, User actor);

    void deleteById(UUID id);
}
