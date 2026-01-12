package com.bernardo.fcs.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bernardo.fcs.controller.dto.CreateIncomeDTO;
import com.bernardo.fcs.controller.dto.IncomeResponseDTO;
import com.bernardo.fcs.controller.dto.UpdateIncomeDTO;
import com.bernardo.fcs.service.IncomeService;

@RestController
@RequestMapping("/users/{userId}/income")
public class IncomeController {
    private IncomeService incomeService;
    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }
    
    @PostMapping
    public ResponseEntity<Void> createIncome(@PathVariable("userId") String userId, @RequestBody CreateIncomeDTO createIncomeDTO) {
        incomeService.createIncome(userId, createIncomeDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<IncomeResponseDTO>> listIncomes(@PathVariable("userId") String userId) {
        var incomes = incomeService.listIncomes(userId);
        return ResponseEntity.ok(incomes);
    }

    @PutMapping("/{incomeId}")
    public ResponseEntity<Void> updateIncomeById(@PathVariable("userId") String userId, @PathVariable("incomeId") String incomeId, @RequestBody UpdateIncomeDTO updateIncomeDTO) {
        incomeService.updateIncomeById(userId, incomeId, updateIncomeDTO);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{incomeId}")
    public ResponseEntity<Void> deleteExpenseById(@PathVariable("userId") String userId, @PathVariable("incomeId") String incomeId) {
        incomeService.deleteIncomeById(userId, incomeId);
        
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> sumIncomes(@PathVariable("userId") String userId) {
        var total = incomeService.sumIncomes(userId);
        return ResponseEntity.ok(total);
    }
}