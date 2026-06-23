package com.luxuryresort.domain.repository;

import com.luxuryresort.domain.entity.Booking;
import com.luxuryresort.domain.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.Nullable;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID>, JpaSpecificationExecutor<Booking> {

    @Query("""
            select count(b) from Booking b
            where b.room.id = :roomId
            and b.status not in :excluded
            and b.checkInDate < :checkOut
            and b.checkOutDate > :checkIn
            """)
    long countActiveOverlap(
            @Param("roomId") UUID roomId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut,
            @Param("excluded") Collection<BookingStatus> excluded
    );

    @EntityGraph(attributePaths = {"room", "user"})
    @Query("select b from Booking b where b.id = :id")
    Optional<Booking> findWithRoomAndUserById(@Param("id") UUID id);

    @EntityGraph(attributePaths = {"room", "user"})
    Page<Booking> findAll(@Nullable Specification<Booking> spec, Pageable pageable);

    long countByStatus(BookingStatus status);

    @Query("""
            select count(b) from Booking b
            where b.status in ('CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT')
            and b.checkInDate <= :d
            and b.checkOutDate > :d
            """)
    long countStaysCoveringDate(@Param("d") LocalDate d);

    @Query("""
            select count(b) from Booking b
            where b.status in ('PENDING', 'CONFIRMED', 'CHECKED_IN')
            and b.checkInDate <= :d
            and b.checkOutDate > :d
            """)
    long countScheduledStaysCoveringDate(@Param("d") LocalDate d);
}
