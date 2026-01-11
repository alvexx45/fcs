package com.bernardo.fcs.controller.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record InvestmentResponseDTO(String investmentId, String type, BigDecimal value, LocalDate date) {}