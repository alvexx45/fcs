package com.bernardo.fcs.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bernardo.fcs.model.Investment;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, UUID> {}
