package com.example.hospital.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hospitals")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String phone;

    @OneToMany(mappedBy = "hospital")
    private List<HospitalDepartment> hospitalDepartments = new ArrayList<>();

    @OneToMany(mappedBy = "hospital")
    private List<Doctor> doctors = new ArrayList<>();

    @OneToMany(mappedBy = "hospital")
    private List<Reservation> reservations = new ArrayList<>();

    @OneToMany(mappedBy = "hospital")
    private List<Review> reviews = new ArrayList<>();
}