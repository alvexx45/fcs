package com.bernardo.fcs.service;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.bernardo.fcs.controller.dto.CreateCreditDTO;
import com.bernardo.fcs.controller.dto.CreditResponseDTO;
import com.bernardo.fcs.controller.dto.UpdateCreditDTO;
import com.bernardo.fcs.model.Credit;
import com.bernardo.fcs.repository.CreditRepository;
import com.bernardo.fcs.repository.UserRepository;

@Service
public class CreditService {
    private UserRepository userRepository;
    private CreditRepository creditRepository;

    public CreditService(UserRepository userRepository, CreditRepository creditRepository) {
        this.userRepository = userRepository;
        this.creditRepository = creditRepository;
    }

    public void createCredit(String userId, CreateCreditDTO createCreditDTO) {
        var user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var entity = new Credit();
        entity.setBillingDay(createCreditDTO.billingDay());
        entity.setUser(user);

        creditRepository.save(entity);
    }

    public List<CreditResponseDTO> listCredits(String userId) {
        var userId_uuid = UUID.fromString(userId);

        if (!userRepository.existsById(userId_uuid)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return creditRepository.findByUser_UserIdOrderByCreationTimestampDesc(userId_uuid)
                .stream()
                .map(credit -> new CreditResponseDTO(
                        credit.getCreditId().toString(),
                        credit.getBillingDay()))
                .toList();
    }

    public void updateCreditById(String userId, String creditId, UpdateCreditDTO updateCreditDTO) {
        var credit = creditRepository.findById(UUID.fromString(creditId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!credit.getUser().getUserId().equals(UUID.fromString(userId))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        if (updateCreditDTO.billingDay() != null) {
            credit.setBillingDay(updateCreditDTO.billingDay());
        }

        creditRepository.save(credit);
    }

    public void deleteCreditById(String userId, String creditId) {
        var credit = creditRepository.findById(UUID.fromString(creditId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!credit.getUser().getUserId().equals(UUID.fromString(userId))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        creditRepository.delete(credit);
    }
}
