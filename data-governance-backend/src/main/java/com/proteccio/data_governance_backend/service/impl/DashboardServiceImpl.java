package com.proteccio.data_governance_backend.service.impl;

import com.proteccio.data_governance_backend.dto.DashboardResponse;
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

        return DashboardResponse.builder()
                .totalDatasets(totalDatasets)
                .totalRows(totalDatasets == 0 ? 0 : datasetRepository.getTotalRows())
                .totalColumns(totalDatasets == 0 ? 0 : datasetRepository.getTotalColumns())
                .averageQuality(totalDatasets == 0 ? 0.0 : datasetRepository.getAverageQuality())
                .averageTrust(totalDatasets == 0 ? 0.0 : datasetRepository.getAverageTrust())
                .averageValue(totalDatasets == 0 ? 0.0 : datasetRepository.getAverageValue())
                .build();
    }
}