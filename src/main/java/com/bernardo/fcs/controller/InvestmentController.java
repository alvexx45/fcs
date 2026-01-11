package com.bernardo.fcs.controller;

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

import com.bernardo.fcs.controller.dto.CreateInvestmentDTO;
import com.bernardo.fcs.controller.dto.InvestmentResponseDTO;
import com.bernardo.fcs.controller.dto.UpdateInvesmentDTO;
import com.bernardo.fcs.service.InvestmentService;

@RestController
@RequestMapping("/users/{userId}/investment")
public class InvestmentController {
    private InvestmentService investmentService;
    public InvestmentController(InvestmentService investmentService) {
        this.investmentService = investmentService;
    }
    
    @PostMapping
    public ResponseEntity<Void> createInvestment(@PathVariable("userId") String userId, @RequestBody CreateInvestmentDTO createInvestmentDTO) {
        investmentService.createInvestment(userId, createInvestmentDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<InvestmentResponseDTO>> listInvestments(@PathVariable("userId") String userId) {
        var investments = investmentService.listInvestments(userId);
        return ResponseEntity.ok(investments);
    }

    @PutMapping("/{investmentId}")
    public ResponseEntity<Void> updateInvestmentById(@PathVariable("userId") String userId, @PathVariable("investmentId") String investmentId, @RequestBody UpdateInvesmentDTO updateInvestmentDTO) {
        investmentService.updateIncomeById(userId, investmentId, updateInvestmentDTO);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{investmentId}")
    public ResponseEntity<Void> deleteExpenseById(@PathVariable("userId") String userId, @PathVariable("investmentId") String investmentId) {
        investmentService.deleteInvestmentById(userId, investmentId);
        
        return ResponseEntity.noContent().build();
    }
}