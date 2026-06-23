package com.luxuryresort.web.controller;

import com.luxuryresort.application.dto.response.AuditLogResponse;
import com.luxuryresort.application.dto.response.PageResponse;
import com.luxuryresort.application.mapper.AuditLogMapper;
import com.luxuryresort.domain.enums.AuditAction;
import com.luxuryresort.domain.repository.AuditLogRepository;
import com.luxuryresort.domain.repository.AuditLogSpecs;
import com.luxuryresort.web.dto.ApiResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/admin/audit-logs")
public class AdminAuditController {

    private final AuditLogRepository auditLogRepository;
    private final AuditLogMapper auditLogMapper;

    public AdminAuditController(AuditLogRepository auditLogRepository, AuditLogMapper auditLogMapper) {
        this.auditLogRepository = auditLogRepository;
        this.auditLogMapper = auditLogMapper;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AuditLogResponse>>> search(
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) AuditAction action,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            @PageableDefault(size = 50, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        String typeFilter = (entityType == null || entityType.isBlank()) ? null : entityType;
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(
                auditLogRepository.findAll(
                                AuditLogSpecs.searchFilter(typeFilter, action, from, to),
                                pageable
                        )
                        .map(auditLogMapper::toResponse)
        )));
    }
}
