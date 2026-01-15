package com.bernardo.fcs.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.bernardo.fcs.controller.dto.CreateUserDTO;
import com.bernardo.fcs.controller.dto.UpdateUserDTO;
import com.bernardo.fcs.controller.dto.UserLoginDTO;
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
        try {
            var entity = new User();

            var validate = userRepository.findByUsername(createUserDTO.username());
            if (!validate.isPresent()) {
                entity.setUsername(createUserDTO.username());
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                entity.setPassword(encoder.encode(createUserDTO.password()));

                var userSaved = userRepository.save(entity);

                return userSaved.getUserId();
            } else {
                throw new IllegalArgumentException("Usuário já existe");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error creating user", e);
        }
    }

    public ResponseEntity<UserResponseDTO> login(@RequestBody UserLoginDTO userLoginDTO) {
        if (userLoginDTO.username() != null) {
            var username = userRepository.findByUsername(userLoginDTO.username());
            if (username.isPresent()) {
                var user = username.get();
                if (userLoginDTO.password() != null) {
                    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
                    if (encoder.matches(userLoginDTO.password(), user.getPassword())) {
                        var userResponse = new UserResponseDTO(
                            user.getUserId().toString(), 
                            user.getUsername()
                        );
                        return ResponseEntity.ok(userResponse);
                    }
                }
            }
        }

        return ResponseEntity.status(401).build();
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
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                user.setPassword(encoder.encode(updateUserDTO.password()));
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
