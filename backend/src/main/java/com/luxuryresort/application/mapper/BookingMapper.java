package com.luxuryresort.application.mapper;

import com.luxuryresort.application.dto.response.BookingResponse;
import com.luxuryresort.application.dto.response.PricingResult;
import com.luxuryresort.domain.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    @Mapping(target = "roomId", source = "room.id")
    @Mapping(target = "roomNumber", source = "room.roomNumber")
    @Mapping(target = "roomName", source = "room.name")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userEmail", source = "user.email")
    @Mapping(target = "pricing", ignore = true)
    BookingResponse mapWithoutPricing(Booking booking);

    default BookingResponse toResponse(Booking booking) {
        return mapWithoutPricing(booking);
    }

    default BookingResponse toResponse(Booking booking, PricingResult pricing) {
        BookingResponse r = mapWithoutPricing(booking);
        return new BookingResponse(
                r.id(),
                r.roomId(),
                r.roomNumber(),
                r.roomName(),
                r.userId(),
                r.userEmail(),
                r.checkInDate(),
                r.checkOutDate(),
                r.guestsCount(),
                r.baseTotal(),
                r.dynamicPriceTotal(),
                r.finalMultiplier(),
                r.status(),
                r.cancellationReason(),
                r.specialRequests(),
                r.loyaltyPointsEarned(),
                r.loyaltyPointsUsed(),
                r.createdAt(),
                r.updatedAt(),
                pricing
        );
    }
}
