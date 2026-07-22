package com.proteccio.data_governance_backend.service.impl;

import com.proteccio.data_governance_backend.dto.DashboardResponse;
import com.proteccio.data_governance_backend.exception.ResourceNotFoundException;
import com.proteccio.data_governance_backend.repository.DatasetRepository;
import com.proteccio.data_governance_backend.service.DashboardService;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final DatasetRepository datasetRepository;

    public DashboardServiceImpl(DatasetRepository datasetRepository) {
        this.datasetRepository = datasetRepository;
    }

    @Override
    public DashboardResponse getDashboard() {

        long totalDatasets = datasetRepository.count();

        if (totalDatasets == 0) {
            throw new ResourceNotFoundException("No datasets available.");
        }

        return DashboardResponse.builder()
                .totalDatasets(totalDatasets)
                .totalRows(datasetRepository.getTotalRows())
                .totalColumns(datasetRepository.getTotalColumns())
                .averageQuality(datasetRepository.getAverageQuality())
                .averageTrust(datasetRepository.getAverageTrust())
                .averageValue(datasetRepository.getAverageValue())
                .build();
    }
}