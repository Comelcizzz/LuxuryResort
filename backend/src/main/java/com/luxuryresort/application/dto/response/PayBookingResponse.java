package com.luxuryresort.application.dto.response;

import com.luxuryresort.domain.enums.BookingStatus;

public record PayBookingResponse(BookingStatus bookingStatus, PaymentResponse payment) {
}
