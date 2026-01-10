package com.bernardo.fcs.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.bernardo.fcs.controller.dto.CreateExpenseDTO;
import com.bernardo.fcs.controller.dto.CreateIncomeDTO;
import com.bernardo.fcs.controller.dto.CreateInvestmentDTO;
import com.bernardo.fcs.controller.dto.CreateUserDTO;
import com.bernardo.fcs.controller.dto.ExpenseResponseDTO;
import com.bernardo.fcs.controller.dto.IncomeResponseDTO;
import com.bernardo.fcs.controller.dto.InvestmentResponseDTO;
import com.bernardo.fcs.controller.dto.UpdateUserDTO;
import com.bernardo.fcs.model.Expense;
import com.bernardo.fcs.model.Income;
import com.bernardo.fcs.model.Investment;
import com.bernardo.fcs.model.User;
import com.bernardo.fcs.repository.ExpenseRepository;
import com.bernardo.fcs.repository.IncomeRepository;
import com.bernardo.fcs.repository.InvestmentRepository;
import com.bernardo.fcs.repository.UserRepository;

@Service
public class UserService {
    private UserRepository userRepository;
    private IncomeRepository incomeRepository;
    private InvestmentRepository investmentRepository;
    private ExpenseRepository expenseRepository;

    public UserService(UserRepository userRepository, IncomeRepository incomeRepository,
            InvestmentRepository investmentRepository, ExpenseRepository expenseRepository) {
        this.userRepository = userRepository;
        this.incomeRepository = incomeRepository;
        this.investmentRepository = investmentRepository;
        this.expenseRepository = expenseRepository;
    }

    // user
    public UUID createUser(CreateUserDTO createUserDTO) {
        var entity = new User();
        entity.setUsername(createUserDTO.username());
        entity.setPassword(createUserDTO.password());

        var userSaved = userRepository.save(entity);
        
        return userSaved.getUserId();
    }

    public Optional<User> getUserById(String userId) {
        return userRepository.findById(UUID.fromString(userId));
    }

    public List<User> listUsers() {
        return userRepository.findAll();
    }

    public void updateUserById(String userId, UpdateUserDTO updateUserDTO) {
        var uid = UUID.fromString(userId);
        var userEntity = userRepository.findById(uid);

        if (userEntity.isPresent()) {
            var user = userEntity.get();

            if (updateUserDTO.username() != null) {
                user.setUsername(updateUserDTO.username());
            }

            if (updateUserDTO.password() != null) {
                user.setPassword(updateUserDTO.password());
            }

            userRepository.save(user);
        }
    }

    public void deleteUserById(String userId) {
        var uid = UUID.fromString(userId);
        var userExists = userRepository.existsById(uid);

        if (userExists) {
            userRepository.deleteById(uid);
        }
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
}
