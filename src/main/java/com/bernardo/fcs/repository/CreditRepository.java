package com.bernardo.fcs.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bernardo.fcs.model.Credit;

@Repository
public interface CreditRepository extends JpaRepository<Credit, UUID> {
    List<Credit> findByUser_UserIdOrderByCreationTimestampDesc(UUID userId);
}
