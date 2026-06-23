package com.luxuryresort.domain.repository;

import com.luxuryresort.domain.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface RoomRepository extends JpaRepository<Room, UUID>, JpaSpecificationExecutor<Room> {

    Optional<Room> findByIdAndDeletedAtIsNull(UUID id);

    long countByDeletedAtIsNull();

    @Query("""
            select count(r) from Room r
            where r.deletedAt is null and r.status <> 'MAINTENANCE'
            """)
    long countSellableRooms();
}
