package com.bernardo.fcs.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", unique = true, nullable = false, length = 12)
    private String username;
    
    @Column(name = "password", nullable = false, length = 30)
    private String password;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Expense> expenses = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Income> incomes = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Investment> investments = new ArrayList<>();

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public List<Expense> getExpenses() { return expenses; }
    public List<Income> getIncomes() { return incomes; }
    public List<Investment> getInvestments() { return investments; }

    public void setId(Long id) { this.id = id; }
    public void setUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Insira um nome de usuário");
        } else if (username.length() > 12) {
            throw new IllegalArgumentException("O nome deve conter no máximo 12 caracteres");
        }
        this.username = username; 
    }
    public void setPassword(String password) {
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Insira uma senha");
        } else if (password.length() > 30) {
            throw new IllegalArgumentException("A senha deve conter no máximo 30 caracteres");
        }
        this.password = password;
    }
}