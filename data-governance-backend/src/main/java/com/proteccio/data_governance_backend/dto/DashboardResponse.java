package com.proteccio.data_governance_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private Long totalDatasets;

    private Long totalRows;

    private Long totalColumns;

    private Double averageQuality;

    private Double averageTrust;

    private Double averageValue;

}