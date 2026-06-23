package com.luxuryresort.application.service;

import com.luxuryresort.domain.entity.User;

import java.util.UUID;

public interface InvoiceService {

    byte[] buildBookingInvoicePdf(UUID bookingId, User actor);
}
