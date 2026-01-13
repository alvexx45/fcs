package com.bernardo.fcs.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bernardo.fcs.model.Investment;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, UUID> {
    // Busca investimentos do usuário ordenados por data (mais recente primeiro)
    List<Investment> findByUser_UserIdOrderByDateDesc(UUID userId);
}
