package com.bernardo.fcs.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bernardo.fcs.controller.dto.CreateExpenseDTO;
import com.bernardo.fcs.controller.dto.ExpenseResponseDTO;
import com.bernardo.fcs.service.ExpenseService;

@RestController
@RequestMapping("/users/{userId}/expense")
public class ExpenseController {
    private ExpenseService expenseService;
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<Void> createExpense(@PathVariable("userId") String userId, @RequestBody CreateExpenseDTO createExpenseDTO) {
        expenseService.createExpense(userId, createExpenseDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponseDTO>> listExpenses(@PathVariable("userId") String userId) {
        var expenses = expenseService.listExpenses(userId);
        return ResponseEntity.ok(expenses);
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpenseById(@PathVariable("userId") String userId, @PathVariable("expenseId") String expenseId) {
        expenseService.deleteExpenseById(userId, expenseId);
        
        return ResponseEntity.noContent().build();
    }
}