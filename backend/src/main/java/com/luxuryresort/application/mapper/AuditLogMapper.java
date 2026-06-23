package com.luxuryresort.application.mapper;

import com.luxuryresort.application.dto.response.AuditLogResponse;
import com.luxuryresort.domain.entity.AuditLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuditLogMapper {

    @Mapping(target = "performedByUserId", source = "performedBy.id")
    @Mapping(target = "performedByEmail", source = "performedBy.email")
    AuditLogResponse toResponse(AuditLog log);
}
