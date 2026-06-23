package com.luxuryresort.application.service.impl;

import com.luxuryresort.application.dto.request.RoomWriteRequest;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.application.dto.response.RoomAvailabilityResponse;
import com.luxuryresort.application.dto.response.RoomResponse;
import com.luxuryresort.application.exception.ResourceNotFoundException;
import com.luxuryresort.application.mapper.RoomMapper;
import com.luxuryresort.application.service.RoomService;
import com.luxuryresort.domain.entity.Room;
import com.luxuryresort.domain.enums.BookingStatus;
import com.luxuryresort.domain.enums.RoomStatus;
import com.luxuryresort.domain.enums.RoomType;
import com.luxuryresort.domain.repository.BookingRepository;
import com.luxuryresort.domain.repository.RoomRepository;
import com.luxuryresort.domain.repository.RoomSpecs;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class RoomServiceImpl implements RoomService {

    private static final List<BookingStatus> EXCLUDED_FROM_OVERLAP = List.of(
            BookingStatus.CANCELLED,
            BookingStatus.NO_SHOW
    );

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final RoomMapper roomMapper;

    public RoomServiceImpl(RoomRepository roomRepository, BookingRepository bookingRepository, RoomMapper roomMapper) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.roomMapper = roomMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<RoomResponse> search(
            String q,
            RoomType type,
            BigDecimal priceMin,
            BigDecimal priceMax,
            Integer maxOccupancy,
            Boolean available,
            Pageable pageable
    ) {
        Specification<Room> spec = RoomSpecs.catalogFilter(q, type, priceMin, priceMax, maxOccupancy, available);
        Page<Room> page = roomRepository.findAll(spec, pageable);
        return PageResponse.from(page.map(roomMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public RoomResponse getById(UUID id) {
        Room room = roomRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        return roomMapper.toResponse(room);
    }

    @Override
    @Transactional(readOnly = true)
    public RoomAvailabilityResponse availability(UUID roomId, LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null || !checkOut.isAfter(checkIn)) {
            throw new IllegalArgumentException("checkIn and checkOut are required; checkOut must be after checkIn");
        }
        Room room = roomRepository.findByIdAndDeletedAtIsNull(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        if (room.getStatus() != RoomStatus.AVAILABLE) {
            return new RoomAvailabilityResponse(false);
        }
        long overlaps = bookingRepository.countActiveOverlap(roomId, checkIn, checkOut, EXCLUDED_FROM_OVERLAP);
        return new RoomAvailabilityResponse(overlaps == 0);
    }

    @Override
    @Transactional
    public RoomResponse create(RoomWriteRequest request) {
        Room room = roomMapper.toEntity(request);
        Instant now = Instant.now();
        room.setAvgRating(BigDecimal.ZERO);
        room.setReviewCount(0);
        room.setCreatedAt(now);
        room.setUpdatedAt(now);
        return roomMapper.toResponse(roomRepository.save(room));
    }

    @Override
    @Transactional
    public RoomResponse update(UUID id, RoomWriteRequest request) {
        Room room = roomRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        roomMapper.merge(request, room);
        room.setUpdatedAt(Instant.now());
        return roomMapper.toResponse(roomRepository.save(room));
    }

    @Override
    @Transactional
    public void softDelete(UUID id) {
        Room room = roomRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        room.setDeletedAt(Instant.now());
        roomRepository.save(room);
    }
}
