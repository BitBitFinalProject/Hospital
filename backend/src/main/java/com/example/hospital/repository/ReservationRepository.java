package com.example.hospital.repository;

import com.example.hospital.domain.Reservation;
import com.example.hospital.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // 특정 사용자의 모든 예약 조회
    List<Reservation> findByUser(User user);

    // 특정 사용자의 활성화된 예약 조회 (취소, 거절, 완료 상태 제외)
    List<Reservation> findByUserAndStatusNotInOrderByReservationDateAscReservationTimeAsc(
            User user, List<Reservation.ReservationStatus> excludedStatuses);

    // 예약 날짜와 시간으로 중복 예약 확인
    boolean existsByHospitalIdAndDepartmentIdAndDoctorIdAndReservationDateAndReservationTimeAndStatusNot(
            Long hospitalId, Long departmentId, Long doctorId, LocalDate date, LocalTime time,
            Reservation.ReservationStatus canceledStatus);

    // 특정 ID의 예약 정보 조회 (조인 사용)
    Optional<Reservation> findByIdAndUser(Long id, User user);
}
