package com.example.hospital.dto;

import com.example.hospital.domain.Reservation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

public class ReservationDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReservationRequest {
        private Long hospitalId;
        private Long departmentId;
        private Long doctorId;
        private String reservationDate; // yyyy-MM-dd 형식
        private String reservationTime; // HH:mm 형식
        private String reason; // 증상이나 메모
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReservationResponse {
        private Long id;
        private String hospitalName;
        private String departmentName;
        private String doctorName;
        private String reservationDate; // yyyy-MM-dd 형식
        private String reservationTime; // HH:mm 형식
        private String reason;
        private String status;
        private String userName;

        public static ReservationResponse fromEntity(Reservation reservation) {
            return ReservationResponse.builder()
                    .id(reservation.getId())
                    .hospitalName(reservation.getHospital().getName())
                    .departmentName(reservation.getDepartment().getName())
                    .doctorName(reservation.getDoctor() != null ? reservation.getDoctor().getName() : "지정되지 않음")
                    .reservationDate(reservation.getReservationDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                    .reservationTime(reservation.getReservationTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                    .reason(reservation.getReason())
                    .status(reservation.getStatus().name())
                    .userName(reservation.getUser().getName())
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReservationListResponse {
        private List<ReservationResponse> reservations;
        private int totalCount;

        public static ReservationListResponse fromEntities(List<Reservation> reservations) {
            List<ReservationResponse> responses = reservations.stream()
                    .map(ReservationResponse::fromEntity)
                    .collect(Collectors.toList());

            return ReservationListResponse.builder()
                    .reservations(responses)
                    .totalCount(responses.size())
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReservationStatusUpdateRequest {
        private Reservation.ReservationStatus status;
    }
}
