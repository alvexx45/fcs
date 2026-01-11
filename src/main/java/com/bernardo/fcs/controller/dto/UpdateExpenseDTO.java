package com.bernardo.fcs.controller.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateExpenseDTO(String type, BigDecimal value, String p_method, LocalDate date) {}