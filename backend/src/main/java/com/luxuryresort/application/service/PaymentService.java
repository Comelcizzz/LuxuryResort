package com.luxuryresort.application.service;

import com.luxuryresort.application.dto.request.PayBookingRequest;
import com.luxuryresort.application.dto.response.PayBookingResponse;
import com.luxuryresort.domain.entity.User;

import java.util.UUID;

public interface PaymentService {

    PayBookingResponse payBooking(UUID bookingId, PayBookingRequest request, User actor);
}
