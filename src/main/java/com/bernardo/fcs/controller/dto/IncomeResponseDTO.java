package com.bernardo.fcs.controller.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record IncomeResponseDTO(String incomeId, String type, String source, BigDecimal value, LocalDate data) {}
