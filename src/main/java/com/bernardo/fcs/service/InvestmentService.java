package com.bernardo.fcs.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.bernardo.fcs.controller.dto.CreateInvestmentDTO;
import com.bernardo.fcs.controller.dto.InvestmentResponseDTO;
import com.bernardo.fcs.controller.dto.UpdateInvesmentDTO;
import com.bernardo.fcs.model.Investment;
import com.bernardo.fcs.repository.InvestmentRepository;
import com.bernardo.fcs.repository.UserRepository;

@Service
public class InvestmentService {
    private UserRepository userRepository;
    private InvestmentRepository investmentRepository;
    
    public InvestmentService(UserRepository userRepository, InvestmentRepository investmentRepository) {
        this.userRepository = userRepository;
        this.investmentRepository = investmentRepository;
    }

    public void createInvestment(String userId, CreateInvestmentDTO createInvestmentDTO) {
        var user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var entity = new Investment();
        entity.setType(createInvestmentDTO.type());
        entity.setValue(createInvestmentDTO.value());
        entity.setDate(createInvestmentDTO.date());
        entity.setUser(user);

        investmentRepository.save(entity);
    }

    public List<InvestmentResponseDTO> listInvestments(String userId) {
        var user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        return user.getInvestments().stream().map(inv -> new InvestmentResponseDTO(inv.getInvestmentId().toString(), inv.getType(),
         inv.getValue(), inv.getDate())).toList();
    }

    public void updateIncomeById(String userId, String investmentId, UpdateInvesmentDTO updateInvesmentDTO) {
        var investment = investmentRepository.findById(UUID.fromString(investmentId))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        if (!investment.getUser().getUserId().equals(UUID.fromString(userId))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        if (updateInvesmentDTO.type() != null) {
            investment.setType(updateInvesmentDTO.type());
        }
        if (updateInvesmentDTO.value() != null) {
            investment.setValue(updateInvesmentDTO.value());
        }
        if (updateInvesmentDTO.date() != null) {
            investment.setDate(updateInvesmentDTO.date());
        }

        investmentRepository.save(investment);
    }

    public void deleteInvestmentById(String userId, String investmentId) {
        var investment = investmentRepository.findById(UUID.fromString(investmentId))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        if (!investment.getUser().getUserId().equals(UUID.fromString(userId))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        
        investmentRepository.delete(investment);
    }

    public BigDecimal sumInvestments(String userId) {
        var user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return user.getInvestments().stream()
                .map(Investment::getValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}