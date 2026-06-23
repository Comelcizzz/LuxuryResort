package com.luxuryresort.application.mapper;

import com.luxuryresort.application.dto.response.PaymentResponse;
import com.luxuryresort.domain.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(target = "bookingId", source = "booking.id")
    PaymentResponse toResponse(Payment payment);
}
