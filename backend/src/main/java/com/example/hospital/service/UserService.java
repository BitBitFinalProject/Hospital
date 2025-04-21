package com.example.hospital.service;

import com.example.hospital.domain.User;
import com.example.hospital.dto.UserDto.UpdateUserRequest;
import com.example.hospital.dto.UserDto.UserResponse;
import com.example.hospital.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * 사용자 정보 조회
     */
    public UserResponse getUserInfo(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email));

        return UserResponse.fromEntity(user);
    }

    /**
     * 사용자 정보 업데이트
     */
    @Transactional
    public UserResponse updateUserInfo(String email, UpdateUserRequest updateRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email));

        // 이메일 중복 확인 (변경하려는 이메일이 현재 이메일과 다른 경우에만)
        if (!user.getEmail().equals(updateRequest.getEmail()) &&
                userRepository.existsByEmail(updateRequest.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다!");
        }

        // User 엔티티 필드 업데이트
        updateUserFields(user, updateRequest);

        // 저장
        User updatedUser = userRepository.save(user);

        return UserResponse.fromEntity(updatedUser);
    }

    /**
     * 사용자 정보 필드 업데이트 메소드
     */
    private void updateUserFields(User user, UpdateUserRequest updateRequest) {
        // 이제 setter 메소드가 있으므로 직접 호출
        user.setName(updateRequest.getName());
        user.setEmail(updateRequest.getEmail());
    }
}