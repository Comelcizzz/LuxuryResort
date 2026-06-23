package com.luxuryresort.application.service.impl;

import com.luxuryresort.application.dto.request.ServiceWriteRequest;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.application.dto.response.RecommendedServiceDto;
import com.luxuryresort.application.dto.response.ServiceResponse;
import com.luxuryresort.application.exception.ResourceNotFoundException;
import com.luxuryresort.application.mapper.ServiceCatalogMapper;
import com.luxuryresort.application.service.ResortCatalogService;
import com.luxuryresort.domain.entity.ServiceEntity;
import com.luxuryresort.domain.enums.ServiceCategory;
import com.luxuryresort.domain.repository.ServiceEntityRepository;
import com.luxuryresort.domain.repository.ServiceSpecs;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ResortCatalogServiceImpl implements ResortCatalogService {

    private final ServiceEntityRepository serviceEntityRepository;
    private final ServiceCatalogMapper serviceCatalogMapper;
    private final Clock clock;

    public ResortCatalogServiceImpl(
            ServiceEntityRepository serviceEntityRepository,
            ServiceCatalogMapper serviceCatalogMapper,
            Clock clock
    ) {
        this.serviceEntityRepository = serviceEntityRepository;
        this.serviceCatalogMapper = serviceCatalogMapper;
        this.clock = clock;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ServiceResponse> list(
            String q,
            ServiceCategory category,
            Boolean available,
            BigDecimal priceMin,
            BigDecimal priceMax,
            Integer durationMin,
            Integer durationMax,
            Pageable pageable
    ) {
        return PageResponse.from(
                serviceEntityRepository.findAll(
                                ServiceSpecs.catalogFilter(q, category, available, priceMin, priceMax, durationMin, durationMax),
                                pageable
                        )
                        .map(serviceCatalogMapper::toResponse)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceResponse getById(UUID id) {
        ServiceEntity entity = serviceEntityRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        return serviceCatalogMapper.toResponse(entity);
    }

    @Override
    @Transactional
    public ServiceResponse create(ServiceWriteRequest request) {
        Instant now = clock.instant();
        ServiceEntity entity = serviceCatalogMapper.toEntity(request);
        entity.setPopularityScore(BigDecimal.ZERO);
        entity.setCreatedAt(now);
        entity.setDeletedAt(null);
        return serviceCatalogMapper.toResponse(serviceEntityRepository.save(entity));
    }

    @Override
    @Transactional
    public ServiceResponse update(UUID id, ServiceWriteRequest request) {
        ServiceEntity entity = serviceEntityRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        serviceCatalogMapper.merge(request, entity);
        return serviceCatalogMapper.toResponse(serviceEntityRepository.save(entity));
    }

    @Override
    @Transactional
    public void softDelete(UUID id) {
        ServiceEntity entity = serviceEntityRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        entity.setDeletedAt(clock.instant());
        serviceEntityRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecommendedServiceDto> recommendations() {
        return serviceEntityRepository.findTop10ByDeletedAtIsNullAndAvailableTrueOrderByPopularityScoreDesc()
                .stream()
                .map(s -> new RecommendedServiceDto(
                        s.getId(),
                        s.getName(),
                        s.getCategory(),
                        s.getPrice(),
                        s.getPopularityScore()
                ))
                .toList();
    }
}
