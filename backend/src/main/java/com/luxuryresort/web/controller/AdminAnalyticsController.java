package com.luxuryresort.web.controller;

import com.luxuryresort.application.dto.response.AdminDashboardResponse;
import com.luxuryresort.application.dto.response.OccupancyTrendResponse;
import com.luxuryresort.application.dto.response.RoomSentimentDto;
import com.luxuryresort.application.service.AdminAnalyticsService;
import com.luxuryresort.web.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/analytics")
public class AdminAnalyticsController {

    private final AdminAnalyticsService adminAnalyticsService;

    public AdminAnalyticsController(AdminAnalyticsService adminAnalyticsService) {
        this.adminAnalyticsService = adminAnalyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> dashboard() {
        return ResponseEntity.ok(ApiResponse.ok(adminAnalyticsService.dashboard()));
    }

    @GetMapping("/occupancy-forecast")
    public ResponseEntity<ApiResponse<OccupancyTrendResponse>> occupancyForecast() {
        return ResponseEntity.ok(ApiResponse.ok(adminAnalyticsService.occupancyTrend()));
    }

    @GetMapping("/room-sentiment")
    public ResponseEntity<ApiResponse<List<RoomSentimentDto>>> roomSentiment() {
        return ResponseEntity.ok(ApiResponse.ok(adminAnalyticsService.roomSentiment()));
    }
}
