package com.bernardo.fcs.controller.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseResponseDTO(String expenseId, String type, BigDecimal value, LocalDate date) {
}