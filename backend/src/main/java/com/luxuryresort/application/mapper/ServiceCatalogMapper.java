package com.luxuryresort.application.mapper;

import com.luxuryresort.application.dto.request.ServiceWriteRequest;
import com.luxuryresort.application.dto.response.ServiceResponse;
import com.luxuryresort.domain.entity.ServiceEntity;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ServiceCatalogMapper {

    ServiceResponse toResponse(ServiceEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "popularityScore", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    ServiceEntity toEntity(ServiceWriteRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void merge(ServiceWriteRequest request, @MappingTarget ServiceEntity entity);
}
