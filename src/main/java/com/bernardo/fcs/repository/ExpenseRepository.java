package com.bernardo.fcs.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bernardo.fcs.model.Expense;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, UUID> {
    // Busca despesas do usuário ordenadas por data (mais recente primeiro)
    List<Expense> findByUser_UserIdOrderByDateDesc(UUID userId);
}