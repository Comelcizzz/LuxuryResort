package com.luxuryresort.application.dto.response;

import com.luxuryresort.domain.enums.BookingStatus;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record AdminDashboardResponse(
        BigDecimal totalRevenue,
        BigDecimal occupancyRate,
        Map<BookingStatus, Long> bookingsByStatus,
        List<RoomRevenueRow> topRooms,
        List<MonthlyRevenueRow> revenueByMonth
) {
    public record RoomRevenueRow(UUID roomId, String roomName, BigDecimal revenue) {
    }

    public record MonthlyRevenueRow(int year, int month, BigDecimal revenue) {
    }
}
