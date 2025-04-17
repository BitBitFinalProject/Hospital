package com.example.hospital.service;

import com.example.hospital.domain.Hospital;
import com.example.hospital.dto.HospitalDto.HospitalListResponse;
import com.example.hospital.dto.HospitalDto.SearchRequest;
import com.example.hospital.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;

    public HospitalListResponse searchHospitals(SearchRequest request) {
        List<Hospital> hospitals;

        // 검색 조건에 따라 적절한 메서드 호출
        if (hasValue(request.getName()) && hasValue(request.getDepartmentName()) && hasValue(request.getAddress())) {
            // 모든 조건이 있는 경우
            hospitals = hospitalRepository.findByNameContainingAndDepartmentNameAndAddressContaining(
                    request.getName(),
                    request.getDepartmentName(),
                    request.getAddress());
        } else if (hasValue(request.getName()) && hasValue(request.getDepartmentName())) {
            // 병원명 + 진료과목
            hospitals = hospitalRepository.findByNameContainingAndDepartmentName(
                    request.getName(),
                    request.getDepartmentName());
        } else if (hasValue(request.getDepartmentName()) && hasValue(request.getAddress())) {
            // 진료과목 + 주소
            hospitals = hospitalRepository.findByDepartmentNameAndAddressContaining(
                    request.getDepartmentName(),
                    request.getAddress());
        } else if (hasValue(request.getName()) && hasValue(request.getAddress())) {
            // 병원명 + 주소
            hospitals = hospitalRepository.findByNameContainingAndAddressContaining(
                    request.getName(),
                    request.getAddress());
        } else if (hasValue(request.getDepartmentName())) {
            // 진료과목만
            hospitals = hospitalRepository.findByDepartmentName(request.getDepartmentName());
        } else if (hasValue(request.getName())) {
            // 병원명만
            hospitals = hospitalRepository.findByNameContaining(request.getName());
        } else if (hasValue(request.getAddress())) {
            // 주소만
            hospitals = hospitalRepository.findByAddressContaining(request.getAddress());
        } else {
            // 검색 조건이 없으면 전체 검색
            hospitals = hospitalRepository.findAll();
        }

        return HospitalListResponse.fromEntities(hospitals);
    }

    public HospitalListResponse getAllHospitals() {
        List<Hospital> hospitals = hospitalRepository.findAll();
        return HospitalListResponse.fromEntities(hospitals);
    }

    private boolean hasValue(String value) {
        return StringUtils.hasText(value);
    }
}
