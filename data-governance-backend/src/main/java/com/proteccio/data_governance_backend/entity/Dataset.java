package com.proteccio.data_governance_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
@Entity
@Table(name = "datasets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dataset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private LocalDateTime uploadTime;

    private Integer rowCount;

    private Integer columnCount;

    private Double qualityScore;

    private Double trustScore;

    private Double valueScore;

    @Builder.Default
    private Integer viewCount = 0;

    @OneToMany(
            mappedBy = "dataset",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonManagedReference
    private List<DatasetColumn> columns = new ArrayList<>();
}