package com.proteccio.data_governance_backend.repository;

import com.proteccio.data_governance_backend.entity.Dataset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DatasetRepository extends JpaRepository<Dataset, Long> {

    @Query("SELECT COALESCE(SUM(d.rowCount),0) FROM Dataset d")
    Long getTotalRows();

    @Query("SELECT COALESCE(SUM(d.columnCount),0) FROM Dataset d")
    Long getTotalColumns();

    @Query("SELECT COALESCE(AVG(d.qualityScore),0) FROM Dataset d")
    Double getAverageQuality();

    @Query("SELECT COALESCE(AVG(d.trustScore),0) FROM Dataset d")
    Double getAverageTrust();

    @Query("SELECT COALESCE(AVG(d.valueScore),0) FROM Dataset d")
    Double getAverageValue();

}