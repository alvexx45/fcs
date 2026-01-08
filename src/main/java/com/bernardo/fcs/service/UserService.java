package com.bernardo.fcs.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bernardo.fcs.controller.CreateUserDTO;
import com.bernardo.fcs.controller.UpdateUserDTO;
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

    public Optional<User> getUserById(String id) {
        return userRepository.findById(UUID.fromString(id));
    }

    public List<User> listUsers() {
        return userRepository.findAll();
    }

    public void updateUserById(String id, UpdateUserDTO updateUserDTO) {
        var uid = UUID.fromString(id);
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

    public void deleteById(String id) {
        var uid = UUID.fromString(id);
        var userExists = userRepository.existsById(uid);

        if (userExists) {
            userRepository.deleteById(uid);
        }
    }
}
