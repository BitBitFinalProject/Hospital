package com.example.hospital.controller;

import com.example.hospital.domain.User;
import com.example.hospital.domain.User.UserRole;
import com.example.hospital.dto.ReservationDto.ReservationListResponse;
import com.example.hospital.dto.ReservationDto.ReservationRequest;
import com.example.hospital.dto.ReservationDto.ReservationResponse;
import com.example.hospital.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    /**
     * 진료 예약 생성 - 일반 사용자(PATIENT)만 가능
     */
    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request,
            @AuthenticationPrincipal User user) {
        try {
            // 사용자 권한 확인
            if (user.getRole() != UserRole.PATIENT) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createErrorResponse("일반 사용자(환자)만 진료 예약이 가능합니다."));
            }

            ReservationResponse response = reservationService.createReservation(request, user);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("예약 생성 중 오류가 발생했습니다."));
        }
    }

    /**
     * 사용자의 모든 예약 목록 조회
     */
    @GetMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> getUserReservations(@AuthenticationPrincipal User user) {
        try {
            // 사용자 권한 확인
            if (user.getRole() != UserRole.PATIENT) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createErrorResponse("일반 사용자(환자)만 자신의 예약을 조회할 수 있습니다."));
            }

            ReservationListResponse response = reservationService.getUserReservations(user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("예약 목록 조회 중 오류가 발생했습니다."));
        }
    }

    /**
     * 활성화된 예약 목록 조회 (취소, 거절, 완료 상태 제외)
     */
    @GetMapping("/active")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> getActiveReservations(@AuthenticationPrincipal User user) {
        try {
            if (user.getRole() != UserRole.PATIENT) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createErrorResponse("일반 사용자(환자)만 예약을 조회할 수 있습니다."));
            }

            ReservationListResponse response = reservationService.getActiveUserReservations(user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("예약 목록 조회 중 오류가 발생했습니다."));
        }
    }

    /**
     * 특정 예약 상세 정보 조회
     */
    @GetMapping("/{reservationId}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> getReservationDetail(@PathVariable Long reservationId,
            @AuthenticationPrincipal User user) {
        try {
            if (user.getRole() != UserRole.PATIENT) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createErrorResponse("일반 사용자(환자)만 예약 상세 정보를 조회할 수 있습니다."));
            }

            ReservationResponse response = reservationService.getReservationDetail(reservationId, user);
            return ResponseEntity.ok(response);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("예약 상세 조회 중 오류가 발생했습니다."));
        }
    }

    /**
     * 예약 취소
     */
    @PostMapping("/{reservationId}/cancel")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> cancelReservation(@PathVariable("reservationId") Long reservationId,
            @AuthenticationPrincipal User user) {
        try {
            if (user.getRole() != UserRole.PATIENT) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createErrorResponse("일반 사용자(환자)만 예약을 취소할 수 있습니다."));
            }

            ReservationResponse response = reservationService.cancelReservation(reservationId, user);
            return ResponseEntity.ok(response);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("예약 취소 중 오류가 발생했습니다."));
        }
    }

    /**
     * 에러 응답 생성 헬퍼 메서드
     */
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("error", message);
        return response;
    }
}
