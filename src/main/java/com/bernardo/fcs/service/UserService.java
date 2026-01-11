package com.bernardo.fcs.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bernardo.fcs.controller.dto.CreateUserDTO;
import com.bernardo.fcs.controller.dto.UpdateUserDTO;
import com.bernardo.fcs.controller.dto.UserResponseDTO;
import com.bernardo.fcs.model.User;
import com.bernardo.fcs.repository.UserRepository;

@Service
public class UserService {
    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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

    public List<UserResponseDTO> listUsers() {
        return userRepository.findAll()
            .stream()
            .map(user -> new UserResponseDTO(
                user.getUserId().toString(), 
                user.getUsername()
            ))
            .toList();
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
}
