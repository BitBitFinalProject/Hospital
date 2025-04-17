package com.example.hospital.dto;

import com.example.hospital.domain.Department;
import com.example.hospital.domain.Hospital;
import com.example.hospital.domain.HospitalDepartment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

public class HospitalDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SearchRequest {
        private String name;
        private String address;
        private String departmentName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentResponse {
        private Long id;
        private String name;

        public static DepartmentResponse fromEntity(Department department) {
            return DepartmentResponse.builder()
                    .id(department.getId())
                    .name(department.getName())
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HospitalResponse {
        private Long id;
        private String name;
        private String address;
        private String phone;
        private List<DepartmentResponse> departments;

        public static HospitalResponse fromEntity(Hospital hospital) {
            List<DepartmentResponse> departments = hospital.getHospitalDepartments().stream()
                    .map(HospitalDepartment::getDepartment)
                    .map(DepartmentResponse::fromEntity)
                    .collect(Collectors.toList());

            return HospitalResponse.builder()
                    .id(hospital.getId())
                    .name(hospital.getName())
                    .address(hospital.getAddress())
                    .phone(hospital.getPhone())
                    .departments(departments)
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HospitalListResponse {
        private List<HospitalResponse> hospitals;
        private int totalCount;

        public static HospitalListResponse fromEntities(List<Hospital> hospitals) {
            List<HospitalResponse> hospitalResponses = hospitals.stream()
                    .map(HospitalResponse::fromEntity)
                    .collect(Collectors.toList());

            return HospitalListResponse.builder()
                    .hospitals(hospitalResponses)
                    .totalCount(hospitalResponses.size())
                    .build();
        }
    }
}