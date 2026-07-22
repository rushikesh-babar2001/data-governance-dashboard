package com.proteccio.data_governance_backend.repository;

import com.proteccio.data_governance_backend.entity.DatasetColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DatasetColumnRepository extends JpaRepository<DatasetColumn, Long> {

    List<DatasetColumn> findByDatasetId(Long datasetId);

}