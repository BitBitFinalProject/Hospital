package com.example.hospital.controller;

import com.example.hospital.dto.HospitalDto.HospitalListResponse;
import com.example.hospital.dto.HospitalDto.HospitalResponse;
import com.example.hospital.dto.HospitalDto.SearchRequest;
import com.example.hospital.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*", maxAge = 3600)
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    /**
     * 모든 병원 목록 조회
     */
    @GetMapping
    public ResponseEntity<HospitalListResponse> getAllHospitals() {
        HospitalListResponse response = hospitalService.getAllHospitals();
        return ResponseEntity.ok(response);
    }

    /**
     * 병원명, 지역, 진료과목으로 검색
     * GET 요청으로 쿼리 파라미터를 통해 검색 조건 전달
     */
    @GetMapping("/search")
    public ResponseEntity<HospitalListResponse> searchHospitals(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String departmentName) {

        SearchRequest request = SearchRequest.builder()
                .name(name)
                .address(address)
                .departmentName(departmentName)
                .build();

        HospitalListResponse response = hospitalService.searchHospitals(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST 요청으로 검색 요청 본문을 통해 전달
     */
    @PostMapping("/search")
    public ResponseEntity<HospitalListResponse> searchHospitalsPost(@RequestBody SearchRequest request) {
        HospitalListResponse response = hospitalService.searchHospitals(request);
        return ResponseEntity.ok(response);
    }
}
