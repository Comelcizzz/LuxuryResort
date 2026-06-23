package com.luxuryresort.application.dto.response;

import java.util.List;

/**
 * Occupancy trend: factual past occupancy and near-future load from existing bookings.
 * Not a machine-learning profit forecast.
 */
public record OccupancyTrendResponse(
        List<OccupancyForecastDto> history,
        List<OccupancyForecastDto> scheduled
) {
}
