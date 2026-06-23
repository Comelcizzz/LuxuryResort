package com.luxuryresort.application.service.impl;

import com.luxuryresort.application.dto.response.AdminDashboardResponse;
import com.luxuryresort.application.dto.response.OccupancyForecastDto;
import com.luxuryresort.application.dto.response.OccupancyTrendResponse;
import com.luxuryresort.application.dto.response.RoomSentimentDto;
import com.luxuryresort.application.service.AdminAnalyticsService;
import com.luxuryresort.domain.enums.BookingStatus;
import com.luxuryresort.domain.repository.BookingRepository;
import com.luxuryresort.domain.repository.PaymentRepository;
import com.luxuryresort.domain.repository.ReviewRepository;
import com.luxuryresort.domain.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Clock;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AdminAnalyticsServiceImpl implements AdminAnalyticsService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final ReviewRepository reviewRepository;
    private final Clock clock;

    public AdminAnalyticsServiceImpl(
            PaymentRepository paymentRepository,
            BookingRepository bookingRepository,
            RoomRepository roomRepository,
            ReviewRepository reviewRepository,
            Clock clock
    ) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.reviewRepository = reviewRepository;
        this.clock = clock;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse dashboard() {
        BigDecimal totalRevenue = paymentRepository.sumCompletedAmount();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }
        long totalRooms = Math.max(1, roomRepository.countSellableRooms());
        LocalDate today = LocalDate.now(clock);
        long occupiedToday = bookingRepository.countStaysCoveringDate(today);
        BigDecimal occupancyRate = BigDecimal.valueOf(occupiedToday)
                .divide(BigDecimal.valueOf(totalRooms), 4, RoundingMode.HALF_UP)
                .min(BigDecimal.ONE);

        Map<BookingStatus, Long> byStatus = new EnumMap<>(BookingStatus.class);
        for (BookingStatus s : BookingStatus.values()) {
            byStatus.put(s, bookingRepository.countByStatus(s));
        }

        List<AdminDashboardResponse.RoomRevenueRow> topRooms = new ArrayList<>();
        for (Object[] row : paymentRepository.topRoomsRevenueRows()) {
            UUID roomId = (UUID) row[0];
            String name = (String) row[1];
            BigDecimal revenue = toMoney(row[2]);
            topRooms.add(new AdminDashboardResponse.RoomRevenueRow(roomId, name, revenue));
        }

        List<AdminDashboardResponse.MonthlyRevenueRow> monthly = new ArrayList<>();
        for (Object[] row : paymentRepository.monthlyRevenueRows()) {
            int year = ((Number) row[0]).intValue();
            int month = ((Number) row[1]).intValue();
            BigDecimal revenue = toMoney(row[2]);
            monthly.add(new AdminDashboardResponse.MonthlyRevenueRow(year, month, revenue));
        }

        return new AdminDashboardResponse(totalRevenue, occupancyRate, byStatus, topRooms, monthly);
    }

    @Override
    @Transactional(readOnly = true)
    public OccupancyTrendResponse occupancyTrend() {
        long totalRooms = Math.max(1, roomRepository.countSellableRooms());
        LocalDate today = LocalDate.now(clock);

        List<OccupancyForecastDto> history = new ArrayList<>();
        for (int i = 13; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            history.add(occupancyPoint(d, bookingRepository.countStaysCoveringDate(d), totalRooms));
        }

        List<OccupancyForecastDto> scheduled = new ArrayList<>();
        for (int i = 0; i < 14; i++) {
            LocalDate d = today.plusDays(i);
            scheduled.add(occupancyPoint(d, bookingRepository.countScheduledStaysCoveringDate(d), totalRooms));
        }

        return new OccupancyTrendResponse(history, scheduled);
    }

    private static OccupancyForecastDto occupancyPoint(LocalDate date, long occupiedRooms, long totalRooms) {
        BigDecimal rate = BigDecimal.valueOf(occupiedRooms)
                .divide(BigDecimal.valueOf(totalRooms), 4, RoundingMode.HALF_UP)
                .min(BigDecimal.ONE);
        return new OccupancyForecastDto(date, rate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomSentimentDto> roomSentiment() {
        List<RoomSentimentDto> out = new ArrayList<>();
        for (Object[] row : reviewRepository.averageSentimentByRoom()) {
            UUID roomId = (UUID) row[0];
            String name = (String) row[1];
            BigDecimal avg = sentimentAvg(row[2]);
            out.add(new RoomSentimentDto(roomId, name, avg.setScale(4, RoundingMode.HALF_UP)));
        }
        return out;
    }

    private static BigDecimal toMoney(Object value) {
        if (value == null) {
            return BigDecimal.ZERO;
        }
        if (value instanceof BigDecimal bd) {
            return bd.setScale(2, RoundingMode.HALF_UP);
        }
        return BigDecimal.valueOf(((Number) value).doubleValue()).setScale(2, RoundingMode.HALF_UP);
    }

    private static BigDecimal sentimentAvg(Object value) {
        if (value == null) {
            return BigDecimal.ZERO;
        }
        if (value instanceof BigDecimal bd) {
            return bd;
        }
        return BigDecimal.valueOf(((Number) value).doubleValue());
    }
}
