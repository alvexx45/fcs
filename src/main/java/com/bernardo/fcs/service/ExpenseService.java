package com.bernardo.fcs.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.bernardo.fcs.controller.dto.CreateExpenseDTO;
import com.bernardo.fcs.controller.dto.ExpenseResponseDTO;
import com.bernardo.fcs.controller.dto.UpdateExpenseDTO;
import com.bernardo.fcs.model.Expense;
import com.bernardo.fcs.repository.ExpenseRepository;
import com.bernardo.fcs.repository.UserRepository;

@Service
public class ExpenseService {
    private UserRepository userRepository;
    private ExpenseRepository expenseRepository;

    public ExpenseService(UserRepository userRepository, ExpenseRepository expenseRepository) {
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
    }

    public void createExpense(String userId, CreateExpenseDTO createExpenseDTO) {
        var user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var entity = new Expense();
        entity.setType(createExpenseDTO.type());
        entity.setValue(createExpenseDTO.value());
        entity.setP_method(createExpenseDTO.p_method());
        entity.setDate(createExpenseDTO.date());
        entity.setUser(user);

        expenseRepository.save(entity);
    }

    public List<ExpenseResponseDTO> listExpenses(String userId) {
        var user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        return user.getExpenses().stream().map(exp -> new ExpenseResponseDTO(exp.getExpenseId().toString(), exp.getType(),
         exp.getValue(), exp.getP_method(), exp.getDate())).toList();   
    }

    public void updateExpenseById(String userId, String expenseId, UpdateExpenseDTO updateExpenseDTO) {
        var expense = expenseRepository.findById(UUID.fromString(expenseId))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        if (!expense.getUser().getUserId().equals(UUID.fromString(userId))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        if (updateExpenseDTO.type() != null) {
            expense.setType(updateExpenseDTO.type());
        }
        if (updateExpenseDTO.value() != null) {
            expense.setValue(updateExpenseDTO.value());
        }
        if (updateExpenseDTO.date() != null) {
            expense.setDate(updateExpenseDTO.date());
        }

        expenseRepository.save(expense);
    }

    public void deleteExpenseById(String userId, String expenseId) {
        var expense = expenseRepository.findById(UUID.fromString(expenseId))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        if (!expense.getUser().getUserId().equals(UUID.fromString(userId))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        
        expenseRepository.delete(expense);
    }

    public BigDecimal sumExpenses(String userId) {
        var user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return user.getExpenses().stream()
                .map(Expense::getValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}