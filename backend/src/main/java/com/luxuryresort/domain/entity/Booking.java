package com.luxuryresort.domain.entity;

import com.luxuryresort.domain.enums.BookingStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcType;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;

    @Column(name = "guests_count", nullable = false)
    private int guestsCount;

    @Column(name = "base_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal baseTotal;

    @Column(name = "dynamic_price_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal dynamicPriceTotal;

    @Column(name = "final_multiplier", nullable = false, precision = 5, scale = 4)
    private BigDecimal finalMultiplier;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "pricing_snapshot", nullable = false, columnDefinition = "jsonb")
    @Builder.Default
    private Map<String, Object> pricingSnapshot = new HashMap<>();

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(nullable = false, columnDefinition = "booking_status")
    private BookingStatus status;

    @Column(name = "cancellation_reason", columnDefinition = "text")
    private String cancellationReason;

    @Column(name = "special_requests", columnDefinition = "text")
    private String specialRequests;

    @Column(name = "loyalty_points_earned", nullable = false)
    private int loyaltyPointsEarned;

    @Column(name = "loyalty_points_used", nullable = false)
    private int loyaltyPointsUsed;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
