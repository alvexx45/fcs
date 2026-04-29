package com.bernardo.fcs.controller.dto;

import java.time.LocalDate;

public record CreditResponseDTO(String creditId, LocalDate billingDay) {

}
