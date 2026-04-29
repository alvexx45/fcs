package com.bernardo.fcs.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

    @ManyToOne
    @JoinColumn(name = "credit_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Credit credit;

    @CreationTimestamp
    private Instant creationTimestamp;
    @UpdateTimestamp
    private Instant updateTimestamp;

    public CreditInstances(UUID creditInstancesId, String type, BigDecimal value, LocalDate date, boolean isRecurrent, Credit credit, Instant creationTimestamp, Instant updateTimestamp) {
        setCreditInstancesId(creditInstancesId);
        setType(type);
        setValue(value);
        setDate(date);
        setRecurrent(isRecurrent);
        setCredit(credit);
        setCreationTimestamp(creationTimestamp);
        setUpdateTimestamp(updateTimestamp);
    }

    public UUID getCreditInstancesId() {
        return creditInstancesId;
    }

    public void setCreditInstancesId(UUID creditInstancesId) {
        this.creditInstancesId = creditInstancesId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public boolean isRecurrent() {
        return isRecurrent;
    }

    public void setRecurrent(boolean isRecurrent) {
        this.isRecurrent = isRecurrent;
    }

    public Credit getCredit() {
        return credit;
    }

    public void setCredit(Credit credit) {
        this.credit = credit;
    }

    public Instant getCreationTimestamp() {
        return creationTimestamp;
    }

    public void setCreationTimestamp(Instant creationTimestamp) {
        this.creationTimestamp = creationTimestamp;
    }

    public Instant getUpdateTimestamp() {
        return updateTimestamp;
    }

    public void setUpdateTimestamp(Instant updateTimestamp) {
        this.updateTimestamp = updateTimestamp;
    }
}
