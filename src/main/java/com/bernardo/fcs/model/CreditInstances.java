package com.bernardo.fcs.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "credit_instances")
public class CreditInstances {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID creditInstancesId;
    private String type;
    private BigDecimal value;
    private LocalDate date;
    private boolean isRecurrent;
}
