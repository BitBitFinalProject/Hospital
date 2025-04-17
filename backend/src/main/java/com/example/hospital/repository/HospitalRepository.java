package com.example.hospital.repository;

import com.example.hospital.domain.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    // 병원명으로 검색
    List<Hospital> findByNameContaining(String name);

    // 주소(지역)로 검색
    List<Hospital> findByAddressContaining(String address);

    // 병원명과 주소로 검색
    List<Hospital> findByNameContainingAndAddressContaining(String name, String address);

    // 진료과목으로 검색
    @Query("SELECT h FROM Hospital h JOIN h.hospitalDepartments hd JOIN hd.department d WHERE d.name = :departmentName")
    List<Hospital> findByDepartmentName(@Param("departmentName") String departmentName);

    // 진료과목과 지역으로 검색
    @Query("SELECT h FROM Hospital h JOIN h.hospitalDepartments hd JOIN hd.department d WHERE d.name = :departmentName AND h.address LIKE %:address%")
    List<Hospital> findByDepartmentNameAndAddressContaining(@Param("departmentName") String departmentName,
            @Param("address") String address);

    // 병원명과 진료과목으로 검색
    @Query("SELECT h FROM Hospital h JOIN h.hospitalDepartments hd JOIN hd.department d WHERE h.name LIKE %:name% AND d.name = :departmentName")
    List<Hospital> findByNameContainingAndDepartmentName(@Param("name") String name,
            @Param("departmentName") String departmentName);

    // 병원명, 진료과목, 지역으로 검색
    @Query("SELECT h FROM Hospital h JOIN h.hospitalDepartments hd JOIN hd.department d WHERE h.name LIKE %:name% AND d.name = :departmentName AND h.address LIKE %:address%")
    List<Hospital> findByNameContainingAndDepartmentNameAndAddressContaining(@Param("name") String name,
            @Param("departmentName") String departmentName, @Param("address") String address);
}
