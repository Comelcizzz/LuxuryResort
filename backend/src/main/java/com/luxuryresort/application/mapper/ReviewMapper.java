package com.luxuryresort.application.mapper;

import com.luxuryresort.application.dto.response.ReviewResponse;
import com.luxuryresort.domain.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(target = "roomId", source = "room.id")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "authorName", expression = "java(review.getUser().getFirstName() + \" \" + review.getUser().getLastName())")
    @Mapping(target = "bookingId", source = "booking.id")
    ReviewResponse toResponse(Review review);
}
