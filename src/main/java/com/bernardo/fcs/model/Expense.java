package com.bernardo.fcs.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "expenses")
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type", nullable = false, length = 20)
    private String type;
    
    @Column(name = "value", nullable = false)
    private BigDecimal value;

    @Column(name = "p_method", nullable = false, length = 50)
    private String p_method;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Long getId() { return id; }
    public String getType() { return type; }
    public BigDecimal getValue() { return value; }
    public String getPMethod() { return p_method; }
    public LocalDate getDate() { return date; }
    public User getUser() { return user; }

    public void setId(Long id) { this.id = id; }
    public void setType(String type) { this.type = type; }
    public void setValue(BigDecimal value) { this.value = value; }
    public void setPMethod(String p_method) { this.p_method = p_method; }
    public void setDate(LocalDate date) { this.date = date; }
    public void setUser(User user) { this.user = user; }
}
