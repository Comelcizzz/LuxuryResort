package com.luxuryresort.application.service;

import com.luxuryresort.application.dto.request.RoomWriteRequest;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.application.dto.response.RoomAvailabilityResponse;
import com.luxuryresort.application.dto.response.RoomResponse;
import com.luxuryresort.domain.enums.RoomType;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public interface RoomService {

    PageResponse<RoomResponse> search(
            String q,
            RoomType type,
            BigDecimal priceMin,
            BigDecimal priceMax,
            Integer maxOccupancy,
            Boolean available,
            Pageable pageable
    );

    RoomResponse getById(UUID id);

    RoomAvailabilityResponse availability(UUID roomId, LocalDate checkIn, LocalDate checkOut);

    RoomResponse create(RoomWriteRequest request);

    RoomResponse update(UUID id, RoomWriteRequest request);

    void softDelete(UUID id);
}
