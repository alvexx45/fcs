package com.bernardo.fcs.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bernardo.fcs.model.CreditInstances;

@Repository
public interface CreditInstancesRepository extends JpaRepository<CreditInstances, UUID> {
    List<CreditInstances> findByCredit_CreditIdOrderByCreationTimestampDesc(UUID creditId);
}
