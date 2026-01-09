package com.bernardo.fcs.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bernardo.fcs.model.Income;

@Repository
public interface IncomeRepository extends JpaRepository<Income, UUID> {}
