package com.example.hospital.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "reservations")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Column(nullable = false)
    private LocalDate reservationDate;

    @Column(nullable = false)
    private LocalTime reservationTime;

    @Column
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    public enum ReservationStatus {
        REQUESTED, APPROVED, REJECTED, CANCELED, COMPLETED
    }
    
    // 예약 상태 변경 메서드
    public void setStatus(ReservationStatus status) {
        this.status = status;
    }
    
    // 예약 담당 의사 변경 메서드
    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }
    
    // 예약 날짜 변경 메서드
    public void setReservationDate(LocalDate reservationDate) {
        this.reservationDate = reservationDate;
    }
    
    // 예약 시간 변경 메서드
    public void setReservationTime(LocalTime reservationTime) {
        this.reservationTime = reservationTime;
    }
    
    // 예약 사유 변경 메서드
    public void setReason(String reason) {
        this.reason = reason;
    }
}