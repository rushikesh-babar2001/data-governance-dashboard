package com.proteccio.data_governance_backend.service;

import com.proteccio.data_governance_backend.entity.Dataset;
import com.proteccio.data_governance_backend.entity.DatasetColumn;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DatasetService {

    String uploadDataset(MultipartFile file);

    List<Dataset> getAllDatasets();

    Dataset getDatasetById(Long id);

    List<DatasetColumn> getDatasetColumns(Long datasetId);
    
    void deleteDataset(Long id);
    
    void updateSensitivity(Long columnId, String sensitivityTag);

}