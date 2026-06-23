package com.luxuryresort.application.dto.response;

import com.luxuryresort.domain.enums.AuditAction;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record AuditLogResponse(
        UUID id,
        String entityType,
        UUID entityId,
        AuditAction action,
        Map<String, Object> oldValue,
        Map<String, Object> newValue,
        UUID performedByUserId,
        String performedByEmail,
        String ipAddress,
        Instant createdAt
) {
}
