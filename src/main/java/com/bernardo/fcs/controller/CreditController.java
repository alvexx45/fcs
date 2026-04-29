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

import com.bernardo.fcs.controller.dto.CreateCreditDTO;
import com.bernardo.fcs.controller.dto.CreditResponseDTO;
import com.bernardo.fcs.controller.dto.UpdateCreditDTO;
import com.bernardo.fcs.service.CreditService;

@RestController
@RequestMapping("/users/{userId}/credit")
public class CreditController {
    private CreditService creditService;

    private CreditController(CreditService creditService) {
        this.creditService = creditService;
    }

    @PostMapping
    public ResponseEntity<Void> createCredit(@PathVariable("userId") String userId,
            @RequestBody CreateCreditDTO createCreditDTO) {
        creditService.createCredit(userId, createCreditDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<CreditResponseDTO>> listCredits(@PathVariable("userId") String userId) {
        var credits = creditService.listCredits(userId);
        return ResponseEntity.ok(credits);
    }

    @PutMapping("/{creditId}")
    public ResponseEntity<Void> updateCreditById(@PathVariable("userId") String userId,
            @PathVariable("creditId") String creditId, @RequestBody UpdateCreditDTO updateCreditDTO) {
        creditService.updateCreditById(userId, creditId, updateCreditDTO);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{creditId}")
    public ResponseEntity<Void> deleteCreditById(@PathVariable("userId") String userId,
            @PathVariable("creditId") String creditId) {
        creditService.deleteCreditById(userId, creditId);

        return ResponseEntity.noContent().build();
    }
}
