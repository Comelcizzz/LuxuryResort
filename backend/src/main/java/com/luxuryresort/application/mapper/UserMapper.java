package com.luxuryresort.application.mapper;

import com.luxuryresort.application.dto.request.RegisterRequest;
import com.luxuryresort.application.dto.request.UpdateProfileRequest;
import com.luxuryresort.application.dto.response.UserResponse;
import com.luxuryresort.domain.entity.User;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "loyaltyPoints", constant = "0")
    UserResponse toResponse(User user);

    @BeanMapping(unmappedSourcePolicy = ReportingPolicy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "role", constant = "GUEST")
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "loyaltyPoints", constant = "0")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toNewUser(RegisterRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void merge(UpdateProfileRequest request, @MappingTarget User user);
}
