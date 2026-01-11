package com.bernardo.fcs.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bernardo.fcs.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    // @Query("SELECT u.username FROM users WHERE u.username = ?");
    Optional<User> findByUsername(String username);
}
