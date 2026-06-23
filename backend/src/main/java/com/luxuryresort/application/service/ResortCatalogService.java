package com.luxuryresort.application.service;

import com.luxuryresort.application.dto.request.ServiceWriteRequest;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.application.dto.response.RecommendedServiceDto;
import com.luxuryresort.application.dto.response.ServiceResponse;
import com.luxuryresort.domain.enums.ServiceCategory;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface ResortCatalogService {

    PageResponse<ServiceResponse> list(
            String q,
            ServiceCategory category,
            Boolean available,
            BigDecimal priceMin,
            BigDecimal priceMax,
            Integer durationMin,
            Integer durationMax,
            Pageable pageable
    );

    ServiceResponse getById(UUID id);

    ServiceResponse create(ServiceWriteRequest request);

    ServiceResponse update(UUID id, ServiceWriteRequest request);

    void softDelete(UUID id);

    List<RecommendedServiceDto> recommendations();
}
