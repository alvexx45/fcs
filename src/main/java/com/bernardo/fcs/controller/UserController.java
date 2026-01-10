package com.bernardo.fcs.controller;

import java.net.URI;
import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bernardo.fcs.controller.dto.CreateIncomeDTO;
import com.bernardo.fcs.controller.dto.CreateUserDTO;
import com.bernardo.fcs.controller.dto.UpdateUserDTO;
import com.bernardo.fcs.model.User;
import com.bernardo.fcs.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
    private UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody CreateUserDTO createUserDTO) {
        var uid = userService.createUser(createUserDTO);
        return ResponseEntity.created(URI.create("/users/" + uid.toString())).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") String id) {
        var user = userService.getUserById(id);

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<User>> listUsers() {
        var users = userService.listUsers();

        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUserById(@PathVariable("id") String id, @RequestBody UpdateUserDTO updateUserDTO) {
        userService.updateUserById(id, updateUserDTO);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable("id") String id) {
        userService.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/income")
    public ResponseEntity<Void> createIncome(@PathVariable("id") String id, @RequestBody CreateIncomeDTO createIncomeDTO) {
        userService.createIncome(id, createIncomeDTO);
        return ResponseEntity.ok().build();
    }

}