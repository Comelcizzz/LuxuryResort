package com.luxuryresort.application.service;

import com.luxuryresort.application.dto.response.AdminDashboardResponse;
import com.luxuryresort.application.dto.response.OccupancyTrendResponse;
import com.luxuryresort.application.dto.response.RoomSentimentDto;

import java.util.List;

public interface AdminAnalyticsService {

    AdminDashboardResponse dashboard();

    OccupancyTrendResponse occupancyTrend();

    List<RoomSentimentDto> roomSentiment();
}
