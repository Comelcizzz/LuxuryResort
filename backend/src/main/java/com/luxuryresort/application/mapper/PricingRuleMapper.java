package com.luxuryresort.application.mapper;

import com.luxuryresort.application.dto.request.PricingRuleWriteRequest;
import com.luxuryresort.application.dto.response.PricingRuleResponse;
import com.luxuryresort.domain.entity.PricingRule;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface PricingRuleMapper {

    PricingRuleResponse toResponse(PricingRule rule);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    PricingRule toEntity(PricingRuleWriteRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void merge(PricingRuleWriteRequest request, @MappingTarget PricingRule rule);
}
