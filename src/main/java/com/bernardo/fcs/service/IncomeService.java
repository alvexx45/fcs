package com.bernardo.fcs.service;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.bernardo.fcs.controller.dto.CreateIncomeDTO;
import com.bernardo.fcs.controller.dto.IncomeResponseDTO;
import com.bernardo.fcs.controller.dto.UpdateIncomeDTO;
import com.bernardo.fcs.model.Income;
import com.bernardo.fcs.repository.IncomeRepository;
import com.bernardo.fcs.repository.UserRepository;

@Service
public class IncomeService {
    private IncomeRepository incomeRepository;
    private UserRepository userRepository;

    public IncomeService(IncomeRepository incomeRepository, UserRepository userRepository) {
        this.incomeRepository = incomeRepository;
        this.userRepository = userRepository;
    }

    // income
    public void createIncome(String userId, CreateIncomeDTO createIncomeDTO) {
        var user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var entity = new Income();
        entity.setType(createIncomeDTO.type());
        entity.setSource(createIncomeDTO.source());
        entity.setValue(createIncomeDTO.value());
        entity.setDate(createIncomeDTO.date());
        entity.setUser(user);

        incomeRepository.save(entity);
    }

    public List<IncomeResponseDTO> listIncomes(String userId) {
        var user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        return user.getIncomes().stream().map(inc -> new IncomeResponseDTO(inc.getIncomeId().toString(), inc.getType(),
         inc.getSource(), inc.getValue(), inc.getDate())).toList();
    }

    public void updateIncomeById(String userId, String incomeId, UpdateIncomeDTO updateIncomeDTO) {
        var income = incomeRepository.findById(UUID.fromString(incomeId))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        if (!income.getUser().getUserId().equals(UUID.fromString(userId))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        if (updateIncomeDTO.type() != null) {
            income.setType(updateIncomeDTO.type());
        }
        if (updateIncomeDTO.source() != null) {
            income.setSource(updateIncomeDTO.source());
        }
        if (updateIncomeDTO.value() != null) {
            income.setValue(updateIncomeDTO.value());
        }
        if (updateIncomeDTO.date() != null) {
            income.setDate(updateIncomeDTO.date());
        }

        incomeRepository.save(income);
    }

    public void deleteIncomeById(String userId, String incomeId) {
        var income = incomeRepository.findById(UUID.fromString(incomeId))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        if (!income.getUser().getUserId().equals(UUID.fromString(userId))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        
        incomeRepository.delete(income);
    }
}