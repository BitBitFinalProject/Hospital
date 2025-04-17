package com.example.hospital.service;

import com.example.hospital.domain.User;
import com.example.hospital.domain.User.UserRole;
import com.example.hospital.dto.UserDto.JwtResponse;
import com.example.hospital.dto.UserDto.LoginRequest;
import com.example.hospital.dto.UserDto.SignupRequest;
import com.example.hospital.repository.UserRepository;
import com.example.hospital.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User userDetails = (User) authentication.getPrincipal();

        return JwtResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .email(userDetails.getEmail())
                .name(userDetails.getName())
                .role(userDetails.getRole().name())
                .build();
    }

    public User registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다!");
        }

        UserRole role = signUpRequest.getRole() != null ? signUpRequest.getRole() : UserRole.PATIENT;

        // 새 사용자 계정 생성
        User user = User.builder()
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .name(signUpRequest.getName())
                .role(role)
                .build();

        return userRepository.save(user);
    }
}
