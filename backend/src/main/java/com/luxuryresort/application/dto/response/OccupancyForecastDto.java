package com.luxuryresort.application.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record OccupancyForecastDto(LocalDate date, BigDecimal predictedOccupancyRate) {
}
