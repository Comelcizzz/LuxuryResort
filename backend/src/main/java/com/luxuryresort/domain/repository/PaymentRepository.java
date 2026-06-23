package com.luxuryresort.domain.repository;

import com.luxuryresort.domain.entity.Payment;
import com.luxuryresort.domain.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    boolean existsByBooking_IdAndStatus(UUID bookingId, PaymentStatus status);

    Optional<Payment> findTopByBooking_IdAndStatusOrderByProcessedAtDesc(UUID bookingId, PaymentStatus status);

    @Query("select coalesce(sum(p.amount), 0) from Payment p where p.status = 'COMPLETED'")
    BigDecimal sumCompletedAmount();

    @Query(
            value = """
                    select extract(year from processed_at)::int,
                           extract(month from processed_at)::int,
                           coalesce(sum(amount), 0)
                    from payments
                    where status = 'COMPLETED' and processed_at is not null
                    group by 1, 2
                    order by 1 desc, 2 desc
                    limit 12
                    """,
            nativeQuery = true
    )
    List<Object[]> monthlyRevenueRows();

    @Query(
            value = """
                    select b.room_id, r.name, coalesce(sum(p.amount), 0)
                    from payments p
                    join bookings b on p.booking_id = b.id
                    join rooms r on b.room_id = r.id
                    where p.status = 'COMPLETED'
                    group by b.room_id, r.name
                    order by 3 desc
                    limit 5
                    """,
            nativeQuery = true
    )
    List<Object[]> topRoomsRevenueRows();
}
