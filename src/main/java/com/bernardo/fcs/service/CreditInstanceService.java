package com.bernardo.fcs.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.bernardo.fcs.controller.dto.CreateCreditInstanceDTO;
import com.bernardo.fcs.controller.dto.CreditInstanceResponseDTO;
import com.bernardo.fcs.controller.dto.UpdateCreditInstanceDTO;
import com.bernardo.fcs.model.CreditInstances;
import com.bernardo.fcs.repository.CreditInstancesRepository;
import com.bernardo.fcs.repository.CreditRepository;
import com.bernardo.fcs.repository.UserRepository;

@Service
public class CreditInstanceService {
    private UserRepository userRepository;
    private CreditRepository creditRepository;
    private CreditInstancesRepository creditInstancesRepository;

    public CreditInstanceService(UserRepository userRepository, CreditRepository creditRepository,
            CreditInstancesRepository creditInstancesRepository) {
        this.userRepository = userRepository;
        this.creditRepository = creditRepository;
        this.creditInstancesRepository = creditInstancesRepository;
    }

    public void createCreditInstance(String userId, String creditId, CreateCreditInstanceDTO createCreditInstanceDTO) {
        var credit = creditRepository.findById(UUID.fromString(creditId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var entity = new CreditInstances();
        entity.setType(createCreditInstanceDTO.type());
        entity.setValue(createCreditInstanceDTO.value());
        entity.setDate(createCreditInstanceDTO.date());
        entity.setRecurrent(createCreditInstanceDTO.isRecurrent());
        entity.setCredit(credit);

        creditInstancesRepository.save(entity);
    }

    public List<CreditInstanceResponseDTO> listCreditInstances(String userId, String creditId) {
        var userId_uuid = UUID.fromString(userId);
        var creditId_uuid = UUID.fromString(creditId);

        if (!userRepository.existsById(userId_uuid)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        var credit = creditRepository.findById(creditId_uuid)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!credit.getUser().getUserId().equals(userId_uuid)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        return creditInstancesRepository.findByCredit_CreditIdOrderByCreationTimestampDesc(creditId_uuid)
                .stream()
                .map(instance -> new CreditInstanceResponseDTO(
                        instance.getCreditInstancesId().toString(),
                        instance.getType(),
                        instance.getValue(),
                        instance.getDate(),
                        instance.isRecurrent()))
                .toList();
    }

    public void updateCreditInstanceById(String userId, String creditId, String creditInstanceId,
            UpdateCreditInstanceDTO updateCreditInstanceDTO) {
        var userId_uuid = UUID.fromString(userId);
        var creditId_uuid = UUID.fromString(creditId);

        var creditInstance = creditInstancesRepository.findById(UUID.fromString(creditInstanceId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!creditInstance.getCredit().getCreditId().equals(creditId_uuid)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        if (!creditInstance.getCredit().getUser().getUserId().equals(userId_uuid)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        if (updateCreditInstanceDTO.type() != null) {
            creditInstance.setType(updateCreditInstanceDTO.type());
        }
        if (updateCreditInstanceDTO.value() != null) {
            creditInstance.setValue(updateCreditInstanceDTO.value());
        }
        if (updateCreditInstanceDTO.date() != null) {
            creditInstance.setDate(updateCreditInstanceDTO.date());
        }
        if (updateCreditInstanceDTO.isRecurrent() != null) {
            creditInstance.setRecurrent(updateCreditInstanceDTO.isRecurrent());
        }

        creditInstancesRepository.save(creditInstance);
    }

    public void deleteCreditInstanceById(String userId, String creditId, String creditInstanceId) {
        var userId_uuid = UUID.fromString(userId);
        var creditId_uuid = UUID.fromString(creditId);

        var creditInstance = creditInstancesRepository.findById(UUID.fromString(creditInstanceId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!creditInstance.getCredit().getCreditId().equals(creditId_uuid)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        if (!creditInstance.getCredit().getUser().getUserId().equals(userId_uuid)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        creditInstancesRepository.delete(creditInstance);
    }

    public BigDecimal sumCreditInstances(String userId, String creditId) {
        var userId_uuid = UUID.fromString(userId);
        var creditId_uuid = UUID.fromString(creditId);

        if (!userRepository.existsById(userId_uuid)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        var credit = creditRepository.findById(creditId_uuid)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!credit.getUser().getUserId().equals(userId_uuid)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        return creditInstancesRepository.findByCredit_CreditIdOrderByCreationTimestampDesc(creditId_uuid)
                .stream()
                .map(CreditInstances::getValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
