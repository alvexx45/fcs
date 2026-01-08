package com.bernardo.fcs.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bernardo.fcs.controller.CreateUserDTO;
import com.bernardo.fcs.model.User;
import com.bernardo.fcs.repository.UserRepository;

@Service
public class UserService {
    private UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public UUID createUser(CreateUserDTO createUserDTO) {
        var entity = new User();
        entity.setUsername(createUserDTO.username());
        entity.setPassword(createUserDTO.password());

        var userSaved = userRepository.save(entity);
        
        return userSaved.getId();
    }
}
