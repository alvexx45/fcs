package com.bernardo.fcs.controller.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreditInstanceResponseDTO(String creditInstancesId, String type, BigDecimal value, LocalDate date, boolean isRecurrent) {

}
