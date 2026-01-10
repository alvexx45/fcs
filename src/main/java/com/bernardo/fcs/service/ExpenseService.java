package com.bernardo.fcs.service;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.bernardo.fcs.controller.dto.CreateExpenseDTO;
import com.bernardo.fcs.controller.dto.ExpenseResponseDTO;
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

    public void deleteExpenseById(String userId, String expenseId) {
        var uid = UUID.fromString(userId);
        var userExists = userRepository.findById(uid);

        var exp_id = UUID.fromString(expenseId);
        var expenseExists = expenseRepository.findById(exp_id);

        var isExpenseFromUser = expenseExists.isPresent() && expenseExists.get().getUser().getUserId().equals(uid);

        if (userExists.isPresent() && expenseExists.isPresent() && isExpenseFromUser) {
            expenseRepository.deleteById(exp_id);
        }
    }
}