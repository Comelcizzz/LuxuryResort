package com.luxuryresort.application.mapper;

import com.luxuryresort.application.dto.response.ServiceOrderResponse;
import com.luxuryresort.domain.entity.ServiceOrder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ServiceOrderMapper {

    @Mapping(target = "serviceId", source = "service.id")
    @Mapping(target = "serviceName", source = "service.name")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "bookingId", expression = "java(order.getBooking() == null ? null : order.getBooking().getId())")
    ServiceOrderResponse toResponse(ServiceOrder order);
}
