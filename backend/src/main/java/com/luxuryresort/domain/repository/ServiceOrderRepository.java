package com.luxuryresort.domain.repository;

import com.luxuryresort.domain.entity.ServiceOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;

import java.util.UUID;

public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, UUID>, JpaSpecificationExecutor<ServiceOrder> {

    @EntityGraph(attributePaths = {"service", "user", "booking"})
    Page<ServiceOrder> findAll(@Nullable Specification<ServiceOrder> spec, Pageable pageable);
}
