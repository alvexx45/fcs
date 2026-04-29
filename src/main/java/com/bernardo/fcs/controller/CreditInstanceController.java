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

import com.bernardo.fcs.controller.dto.CreateCreditInstanceDTO;
import com.bernardo.fcs.controller.dto.CreditInstanceResponseDTO;
import com.bernardo.fcs.controller.dto.UpdateCreditInstanceDTO;
import com.bernardo.fcs.service.CreditInstanceService;

@RestController
@RequestMapping("/users/{userId}/credit/{creditId}/instance")
public class CreditInstanceController {
    private CreditInstanceService creditInstanceService;

    public CreditInstanceController(CreditInstanceService creditInstanceService) {
        this.creditInstanceService = creditInstanceService;
    }

    @PostMapping
    public ResponseEntity<Void> createCreditInstance(@PathVariable("userId") String userId,
            @PathVariable("creditId") String creditId, @RequestBody CreateCreditInstanceDTO createCreditInstanceDTO) {
        creditInstanceService.createCreditInstance(userId, creditId, createCreditInstanceDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<CreditInstanceResponseDTO>> listCreditInstances(@PathVariable("userId") String userId,
            @PathVariable("creditId") String creditId) {
        var instances = creditInstanceService.listCreditInstances(userId, creditId);
        return ResponseEntity.ok(instances);
    }

    @PutMapping("/{creditInstanceId}")
    public ResponseEntity<Void> updateCreditInstanceById(@PathVariable("userId") String userId,
            @PathVariable("creditId") String creditId, @PathVariable("creditInstanceId") String creditInstanceId,
            @RequestBody UpdateCreditInstanceDTO updateCreditInstanceDTO) {
        creditInstanceService.updateCreditInstanceById(userId, creditId, creditInstanceId, updateCreditInstanceDTO);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{creditInstanceId}")
    public ResponseEntity<Void> deleteCreditInstanceById(@PathVariable("userId") String userId,
            @PathVariable("creditId") String creditId, @PathVariable("creditInstanceId") String creditInstanceId) {
        creditInstanceService.deleteCreditInstanceById(userId, creditId, creditInstanceId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> sumCreditInstances(@PathVariable("userId") String userId,
            @PathVariable("creditId") String creditId) {
        var total = creditInstanceService.sumCreditInstances(userId, creditId);
        return ResponseEntity.ok(total);
    }
}
