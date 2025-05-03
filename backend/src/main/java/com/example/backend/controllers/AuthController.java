package com.example.backend.controllers;

import com.example.backend.entities.User;
import com.example.backend.repositories.UserRepository;
import com.example.backend.services.EmailService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    // 🔹 1️⃣ User Registration with OTP Verification
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> requestData) {
        String fullName = requestData.get("fullName");
        String email = requestData.get("email");
        String password = requestData.get("password");
        String role = requestData.get("role");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered!");
        }

        // OTP Generation
        String otp = generateOTP();
        LocalDateTime otpExpiry = LocalDateTime.now().plus(5, ChronoUnit.MINUTES); // OTP valid for 5 min

        User user = new User(fullName, email, passwordEncoder.encode(password), User.Role.valueOf(role.toUpperCase()), otp, otpExpiry, LocalDateTime.now().toString());
        userRepository.save(user);

        try {
            emailService.sendVerificationEmail(email, "Your OTP for email verification: " + otp);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error sending OTP email.");
        }

        System.out.println("OTP for " + email + " = " + otp);
        return ResponseEntity.ok("Registration successful! Please check your email for OTP.");
    }

    // 🔹 2️⃣ OTP Verification
    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> requestData) {
        String email = requestData.get("email");
        String otp = requestData.get("otp");

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        User user = userOptional.get();
        if (user.getOtpCode().equals(otp) && LocalDateTime.now().isBefore(user.getOtpExpiry())) {
            user.setStatus(User.Status.ACTIVE);
            user.setOtpCode(null); // OTP used, so remove it
            user.setOtpExpiry(null);
            userRepository.save(user);
            return ResponseEntity.ok("Email verified successfully! You can now log in.");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired OTP!");
        }
    }

    // 🔹 3️⃣ Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> requestData, HttpServletRequest request) {
        String email = requestData.get("email");
        String password = requestData.get("password");

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPasswordHash())) {
                if (user.getStatus() != User.Status.ACTIVE) {
                    return ResponseEntity.badRequest().body("Account not verified!");
                }

                request.getSession().setAttribute("user", user);
                String redirectUrl = (user.getRole() == User.Role.ADMIN) ? "/admin-dashboard" : "/sales-dashboard";
                return ResponseEntity.ok(Map.of("message", "Login successful!", "redirect", redirectUrl));
            }
        }
        return ResponseEntity.badRequest().body("Invalid email or password!");
    }

    // 🔹 4️⃣ Forgot Password (send OTP)
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> requestData) {
        String email = requestData.get("email");

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User with this email does not exist!");
        }

        User user = userOptional.get();
        String otp = generateOTP();
        LocalDateTime otpExpiry = LocalDateTime.now().plus(5, ChronoUnit.MINUTES);

        user.setOtpCode(otp);
        user.setOtpExpiry(otpExpiry);
        userRepository.save(user);

        try {
            emailService.sendVerificationEmail(email, "Your OTP for password reset is: " + otp);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error sending OTP email.");
        }

        System.out.println("Password Reset OTP for " + email + ": " + otp);
        return ResponseEntity.ok("OTP sent to your email for password reset.");
    }

    // 🔹 5️⃣ Reset Password (with OTP)
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> requestData) {
        String email = requestData.get("email");
        String otp = requestData.get("otp");
        String newPassword = requestData.get("newPassword");

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        User user = userOptional.get();
        if (user.getOtpCode() == null || user.getOtpExpiry() == null) {
            return ResponseEntity.badRequest().body("No OTP request found for this user!");
        }

        if (user.getOtpCode().equals(otp) && LocalDateTime.now().isBefore(user.getOtpExpiry())) {
            user.setPasswordHash(passwordEncoder.encode(newPassword));
            user.setOtpCode(null);
            user.setOtpExpiry(null);
            userRepository.save(user);
            return ResponseEntity.ok("Password reset successfully! You can now login with new password.");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired OTP!");
        }
    }

    // 🔹 OTP Generator
    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // 6-digit OTP
        return String.valueOf(otp);
    }
}