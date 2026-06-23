package com.luxuryresort.domain.repository;

import com.luxuryresort.domain.entity.ServiceEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ServiceEntityRepository extends JpaRepository<ServiceEntity, UUID>, JpaSpecificationExecutor<ServiceEntity> {

    Optional<ServiceEntity> findByIdAndDeletedAtIsNull(UUID id);

    Page<ServiceEntity> findAllByDeletedAtIsNull(Pageable pageable);

    List<ServiceEntity> findTop10ByDeletedAtIsNullAndAvailableTrueOrderByPopularityScoreDesc();
}
