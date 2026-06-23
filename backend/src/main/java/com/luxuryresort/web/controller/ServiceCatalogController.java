package com.luxuryresort.web.controller;

import com.luxuryresort.application.dto.request.ServiceWriteRequest;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.application.dto.response.RecommendedServiceDto;
import com.luxuryresort.application.dto.response.ServiceResponse;
import com.luxuryresort.application.service.ResortCatalogService;
import com.luxuryresort.domain.enums.ServiceCategory;
import com.luxuryresort.web.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/services")
public class ServiceCatalogController {

    private final ResortCatalogService resortCatalogService;

    public ServiceCatalogController(ResortCatalogService resortCatalogService) {
        this.resortCatalogService = resortCatalogService;
    }

    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<RecommendedServiceDto>>> recommendations() {
        return ResponseEntity.ok(ApiResponse.ok(resortCatalogService.recommendations()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ServiceResponse>>> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) ServiceCategory category,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) BigDecimal priceMin,
            @RequestParam(required = false) BigDecimal priceMax,
            @RequestParam(required = false) Integer durationMin,
            @RequestParam(required = false) Integer durationMax,
            @PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                resortCatalogService.list(q, category, available, priceMin, priceMax, durationMin, durationMax, pageable)
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(resortCatalogService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ServiceResponse>> create(@Valid @RequestBody ServiceWriteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(resortCatalogService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody ServiceWriteRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(resortCatalogService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        resortCatalogService.softDelete(id);
        return ResponseEntity.noContent().build();
    }
}
