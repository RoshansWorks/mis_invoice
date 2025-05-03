package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.INACTIVE;

    @Column(nullable = false, updatable = false)
    private String createdAt;

    private String otpCode;
    private LocalDateTime otpExpiry;

    public enum Role {
        ADMIN, SALESPERSON
    }

    public enum Status {
        ACTIVE, INACTIVE
    }

    // ✅ Constructor without OTP (For login and other purposes)
    public User(String fullName, String email, String passwordHash, Role role, String createdAt) {
        this.fullName = fullName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.createdAt = createdAt;
        this.status = Status.INACTIVE;
    }

    // ✅ Constructor with OTP (For registration with email verification)
    public User(String fullName, String email, String passwordHash, Role role, String otpCode, LocalDateTime otpExpiry, String createdAt) {
        this.fullName = fullName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.otpCode = otpCode;
        this.otpExpiry = otpExpiry;
        this.createdAt = createdAt;
        this.status = Status.INACTIVE;
    }
}