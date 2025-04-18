package com.example.hospital.service;

import com.example.hospital.domain.Department;
import com.example.hospital.domain.Doctor;
import com.example.hospital.domain.Hospital;
import com.example.hospital.domain.Reservation;
import com.example.hospital.domain.User;
import com.example.hospital.dto.ReservationDto.ReservationListResponse;
import com.example.hospital.dto.ReservationDto.ReservationRequest;
import com.example.hospital.dto.ReservationDto.ReservationResponse;
import com.example.hospital.dto.ReservationDto.ReservationUpdateRequest;
import com.example.hospital.repository.DepartmentRepository;
import com.example.hospital.repository.DoctorRepository;
import com.example.hospital.repository.HospitalRepository;
import com.example.hospital.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    /**
     * 새로운 진료 예약 생성
     */
    @Transactional
    public ReservationResponse createReservation(ReservationRequest request, User currentUser) {
        // 요청한 병원, 부서, 의사가 존재하는지 확인
        Hospital hospital = hospitalRepository.findById(request.getHospitalId())
                .orElseThrow(() -> new IllegalArgumentException("해당 병원을 찾을 수 없습니다."));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("해당 진료과를 찾을 수 없습니다."));

        Doctor doctor = null;
        if (request.getDoctorId() != null) {
            doctor = doctorRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 의사를 찾을 수 없습니다."));
        }

        // 날짜와 시간 문자열을 변환
        LocalDate reservationDate = LocalDate.parse(request.getReservationDate(),
                DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        LocalTime reservationTime = LocalTime.parse(request.getReservationTime(), DateTimeFormatter.ofPattern("HH:mm"));

        // 예약 시간이 이미 사용 중인지 확인
        boolean isTimeSlotTaken = reservationRepository
                .existsByHospitalIdAndDepartmentIdAndDoctorIdAndReservationDateAndReservationTimeAndStatusNot(
                        hospital.getId(), department.getId(), doctor != null ? doctor.getId() : null,
                        reservationDate, reservationTime, Reservation.ReservationStatus.CANCELED);

        if (isTimeSlotTaken) {
            throw new IllegalStateException("선택한 시간에 이미 예약이 있습니다. 다른 시간을 선택해주세요.");
        }

        // 새 예약 생성
        Reservation reservation = Reservation.builder()
                .user(currentUser)
                .hospital(hospital)
                .department(department)
                .doctor(doctor)
                .reservationDate(reservationDate)
                .reservationTime(reservationTime)
                .reason(request.getReason())
                .status(Reservation.ReservationStatus.REQUESTED)
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);
        return ReservationResponse.fromEntity(savedReservation);
    }

    /**
     * 예약 수정
     */
    @Transactional
    public ReservationResponse updateReservation(Long reservationId, ReservationUpdateRequest request,
            User currentUser) {
        // 예약 정보 조회 및 권한 확인
        Reservation reservation = reservationRepository.findByIdAndUser(reservationId, currentUser)
                .orElseThrow(() -> new AccessDeniedException("해당 예약을 찾을 수 없거나 접근 권한이 없습니다."));

        // 이미 취소된 예약인지 확인
        if (reservation.getStatus() == Reservation.ReservationStatus.CANCELED) {
            throw new IllegalStateException("이미 취소된 예약은 수정할 수 없습니다.");
        }

        // 이미 완료된 예약인지 확인
        if (reservation.getStatus() == Reservation.ReservationStatus.COMPLETED) {
            throw new IllegalStateException("이미 완료된 예약은 수정할 수 없습니다.");
        }

        // 의사 정보 변경
        Doctor doctor = reservation.getDoctor();
        if (request.getDoctorId() != null &&
                (reservation.getDoctor() == null || !reservation.getDoctor().getId().equals(request.getDoctorId()))) {
            doctor = doctorRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 의사를 찾을 수 없습니다."));

            // 선택한 의사가 해당 병원과 진료과에 속하는지 확인
            if (!doctor.getHospital().getId().equals(reservation.getHospital().getId()) ||
                    !doctor.getDepartment().getId().equals(reservation.getDepartment().getId())) {
                throw new IllegalArgumentException("선택한 의사는 해당 병원/진료과에 속하지 않습니다.");
            }
        }

        // 날짜와 시간 파싱
        LocalDate newDate = request.getReservationDate() != null
                ? LocalDate.parse(request.getReservationDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                : reservation.getReservationDate();

        LocalTime newTime = request.getReservationTime() != null
                ? LocalTime.parse(request.getReservationTime(), DateTimeFormatter.ofPattern("HH:mm"))
                : reservation.getReservationTime();

        // 날짜/시간이나 의사가 변경된 경우, 시간대 중복 확인
        if (!newDate.equals(reservation.getReservationDate()) ||
                !newTime.equals(reservation.getReservationTime()) ||
                (doctor != null && !doctor.equals(reservation.getDoctor()))) {

            boolean isTimeSlotTaken = reservationRepository
                    .existsByHospitalIdAndDepartmentIdAndDoctorIdAndReservationDateAndReservationTimeAndStatusNot(
                            reservation.getHospital().getId(),
                            reservation.getDepartment().getId(),
                            doctor != null ? doctor.getId() : null,
                            newDate,
                            newTime,
                            Reservation.ReservationStatus.CANCELED);

            // 자신의 예약은 제외
            if (isTimeSlotTaken &&
                    !reservationRepository.findByIdAndUser(reservationId, currentUser).isPresent()) {
                throw new IllegalStateException("선택한 시간에 이미 예약이 있습니다. 다른 시간을 선택해주세요.");
            }
        }

        // 예약 정보 업데이트
        reservation.setDoctor(doctor);
        reservation.setReservationDate(newDate);
        reservation.setReservationTime(newTime);

        if (request.getReason() != null) {
            reservation.setReason(request.getReason());
        }

        // 상태를 다시 요청됨으로 변경
        reservation.setStatus(Reservation.ReservationStatus.REQUESTED);

        Reservation updatedReservation = reservationRepository.save(reservation);
        return ReservationResponse.fromEntity(updatedReservation);
    }

    /**

     * 사용자의 모든 예약 조회
     */
    @Transactional(readOnly = true)
    public ReservationListResponse getUserReservations(User currentUser) {
        List<Reservation> reservations = reservationRepository.findByUser(currentUser);
        return ReservationListResponse.fromEntities(reservations);
    }

    /**
     * 사용자의 활성화된 예약만 조회 (취소/거절/완료 상태 제외)
     */
    @Transactional(readOnly = true)
    public ReservationListResponse getActiveUserReservations(User currentUser) {
        List<Reservation.ReservationStatus> excludedStatuses = Arrays.asList(
                Reservation.ReservationStatus.CANCELED,
                Reservation.ReservationStatus.REJECTED,
                Reservation.ReservationStatus.COMPLETED);

        List<Reservation> activeReservations = reservationRepository
                .findByUserAndStatusNotInOrderByReservationDateAscReservationTimeAsc(currentUser, excludedStatuses);

        return ReservationListResponse.fromEntities(activeReservations);
    }

    /**
     * 예약 상세 정보 조회
     */
    @Transactional(readOnly = true)
    public ReservationResponse getReservationDetail(Long reservationId, User currentUser) {
        Reservation reservation = reservationRepository.findByIdAndUser(reservationId, currentUser)
                .orElseThrow(() -> new AccessDeniedException("해당 예약을 찾을 수 없거나 접근 권한이 없습니다."));

        return ReservationResponse.fromEntity(reservation);
    }

    /**
     * 예약 취소
     */
    @Transactional
    public ReservationResponse cancelReservation(Long reservationId, User currentUser) {
        Reservation reservation = reservationRepository.findByIdAndUser(reservationId, currentUser)
                .orElseThrow(() -> new AccessDeniedException("해당 예약을 찾을 수 없거나 접근 권한이 없습니다."));

        // 이미 취소된 예약인지 확인
        if (reservation.getStatus() == Reservation.ReservationStatus.CANCELED) {
            throw new IllegalStateException("이미 취소된 예약입니다.");
        }

        // 이미 완료된 예약인지 확인
        if (reservation.getStatus() == Reservation.ReservationStatus.COMPLETED) {
            throw new IllegalStateException("이미 완료된 예약은 취소할 수 없습니다.");
        }

        // 상태 변경
        reservation.setStatus(Reservation.ReservationStatus.CANCELED);
        Reservation updatedReservation = reservationRepository.save(reservation);

        return ReservationResponse.fromEntity(updatedReservation);
    }
}
