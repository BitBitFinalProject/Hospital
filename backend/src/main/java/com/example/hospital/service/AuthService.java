package com.example.hospital.service;

import com.example.hospital.domain.User;
import com.example.hospital.domain.User.UserRole;
import com.example.hospital.dto.UserDto.AdminJwtResponse;
import com.example.hospital.dto.UserDto.AdminLoginRequest;
import com.example.hospital.dto.UserDto.JwtResponse;
import com.example.hospital.dto.UserDto.LoginRequest;
import com.example.hospital.dto.UserDto.SignupRequest;
import com.example.hospital.repository.UserRepository;
import com.example.hospital.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
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

    public AdminJwtResponse authenticateAdmin(AdminLoginRequest loginRequest) {
        try {
            // 먼저 인증 시도
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            // 인증 성공 시 사용자 정보 가져오기
            User userDetails = (User) authentication.getPrincipal();

            // 관리자 권한 확인
            if (userDetails.getRole() != UserRole.ADMIN) {
                throw new SecurityException("관리자 권한이 없습니다.");
            }

            // JWT 토큰 생성
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            // 관리자 응답 생성
            return AdminJwtResponse.builder()
                    .token(jwt)
                    .id(userDetails.getId())
                    .email(userDetails.getEmail())
                    .name(userDetails.getName())
                    .isAdmin(true)
                    .build();
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("이메일 또는 비밀번호가 잘못되었습니다.");
        } catch (SecurityException e) {
            throw new SecurityException(e.getMessage());
        }
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
