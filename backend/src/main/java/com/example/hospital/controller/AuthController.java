package com.example.hospital.controller;

import com.example.hospital.domain.User;
import com.example.hospital.dto.UserDto.JwtResponse;
import com.example.hospital.dto.UserDto.LoginRequest;
import com.example.hospital.dto.UserDto.MessageResponse;
import com.example.hospital.dto.UserDto.SignupRequest;
import com.example.hospital.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    @Autowired
    private AuthService authService;

    //로그인
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(jwtResponse);
    }

    //회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        try {
            User user = authService.registerUser(signUpRequest);
            return ResponseEntity.ok(MessageResponse.builder()
                    .message("회원가입이 성공적으로 완료되었습니다.")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(MessageResponse.builder()
                    .message(e.getMessage())
                    .build());
        }
    }
}
