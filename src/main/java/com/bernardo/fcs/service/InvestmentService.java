package com.bernardo.fcs.service;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.bernardo.fcs.controller.dto.CreateInvestmentDTO;
import com.bernardo.fcs.controller.dto.InvestmentResponseDTO;
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

    public void deleteInvestmentById(String userId, String expenseId) {
        var uid = UUID.fromString(userId);
        var userExists = userRepository.findById(uid);

        var inv_id = UUID.fromString(expenseId);
        var investmentExists = investmentRepository.findById(inv_id);

        var isInvestmentFromUser = investmentExists.isPresent() && investmentExists.get().getUser().getUserId().equals(uid);

        if (userExists.isPresent() && investmentExists.isPresent() && isInvestmentFromUser) {
            investmentRepository.deleteById(inv_id);
        }
    }
}