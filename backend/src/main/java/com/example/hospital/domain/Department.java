package com.example.hospital.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "departments")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "department")
    private List<HospitalDepartment> hospitalDepartments = new ArrayList<>();

    @OneToMany(mappedBy = "department")
    private List<Doctor> doctors = new ArrayList<>();

    @OneToMany(mappedBy = "department")
    private List<Reservation> reservations = new ArrayList<>();
}