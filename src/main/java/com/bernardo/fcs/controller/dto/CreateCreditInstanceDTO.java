package com.bernardo.fcs.controller.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateCreditInstanceDTO(String type, BigDecimal value, LocalDate date, boolean isRecurrent) {

}
