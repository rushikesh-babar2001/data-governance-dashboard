package com.proteccio.data_governance_backend.service.impl;

import com.proteccio.data_governance_backend.entity.Dataset;
import com.proteccio.data_governance_backend.entity.DatasetColumn;
import com.proteccio.data_governance_backend.exception.ResourceNotFoundException;
import com.proteccio.data_governance_backend.repository.DatasetColumnRepository;
import com.proteccio.data_governance_backend.repository.DatasetRepository;
import com.proteccio.data_governance_backend.service.DatasetService;
import com.proteccio.data_governance_backend.util.CsvUtil;
import com.proteccio.data_governance_backend.util.DataTypeUtil;
import com.proteccio.data_governance_backend.util.QualityUtil;
import com.proteccio.data_governance_backend.util.SensitivityUtil;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DatasetServiceImpl implements DatasetService {

    private final DatasetRepository datasetRepository;
    private final DatasetColumnRepository datasetColumnRepository;

    public DatasetServiceImpl(DatasetRepository datasetRepository,
                              DatasetColumnRepository datasetColumnRepository) {
        this.datasetRepository = datasetRepository;
        this.datasetColumnRepository = datasetColumnRepository;
    }

    @Override
    public String uploadDataset(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please upload a valid CSV file.");
        }

        if (file.getOriginalFilename() == null
                || !file.getOriginalFilename().toLowerCase().endsWith(".csv")) {

            throw new IllegalArgumentException("Only CSV files are allowed.");
        }

        try {

            CSVParser parser = CsvUtil.parse(file);
            List<CSVRecord> records = parser.getRecords();

            Dataset dataset = new Dataset();

            dataset.setFileName(file.getOriginalFilename());
            dataset.setUploadTime(LocalDateTime.now());
            dataset.setRowCount(records.size());
            dataset.setColumnCount(parser.getHeaderMap().size());

            dataset.setQualityScore(0.0);
            dataset.setTrustScore(0.0);
            dataset.setValueScore(0.0);
            dataset.setViewCount(0);

            dataset = datasetRepository.save(dataset);

            CSVRecord firstRecord = records.isEmpty() ? null : records.get(0);

            double totalMissing = 0.0;
            double totalInvalid = 0.0;
            int importantColumns = 0;

            for (String header : parser.getHeaderMap().keySet()) {

                DatasetColumn column = new DatasetColumn();

                column.setColumnName(header);

                String dataType = "STRING";

                if (firstRecord != null) {
                    dataType = DataTypeUtil.detectDataType(firstRecord.get(header));
                }

                column.setDataType(dataType);

                String sensitivity =
                        SensitivityUtil.detectSensitivity(header);

                column.setSensitivityTag(sensitivity);

                double missing =
                        QualityUtil.calculateMissingPercentage(records, header);

                column.setMissingPercentage(missing);

                double invalid =
                        QualityUtil.calculateInvalidPercentage(
                                records,
                                header,
                                dataType);

                column.setInvalidPercentage(invalid);

                totalMissing += missing;
                totalInvalid += invalid;

                if (!"PUBLIC".equalsIgnoreCase(sensitivity)) {
                    importantColumns++;
                }

                column.setDataset(dataset);

                datasetColumnRepository.save(column);
            }

            dataset.setQualityScore(
                    QualityUtil.calculateQualityScore(
                            totalMissing,
                            dataset.getColumnCount()));

            dataset.setTrustScore(
                    QualityUtil.calculateTrustScore(
                            totalInvalid,
                            dataset.getColumnCount()));

            dataset.setValueScore(
                    QualityUtil.calculateValueScore(
                            importantColumns,
                            dataset.getColumnCount()));

            datasetRepository.save(dataset);

            return "Dataset uploaded successfully.";

        } catch (IOException e) {

            throw new IllegalArgumentException("Unable to read CSV file.");

        }
    }

    @Override
    public List<Dataset> getAllDatasets() {

        return datasetRepository.findAll();

    }

    @Override
    public Dataset getDatasetById(Long id) {

        return datasetRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Dataset not found with id: " + id));

    }

    @Override
    public List<DatasetColumn> getDatasetColumns(Long datasetId) {

        return datasetColumnRepository.findByDatasetId(datasetId);

    }

    @Override
    public void deleteDataset(Long id) {

        Dataset dataset = datasetRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Dataset not found with id: " + id));

        datasetRepository.delete(dataset);

    }

    @Override
    public void updateSensitivity(Long columnId,
                                  String sensitivityTag) {

        DatasetColumn column = datasetColumnRepository.findById(columnId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Column not found with id: " + columnId));

        List<String> validTags = List.of(
                "PUBLIC",
                "PERSONAL",
                "PII",
                "CONFIDENTIAL"
        );

        if (!validTags.contains(sensitivityTag.toUpperCase())) {
            throw new IllegalArgumentException(
                    "Invalid sensitivity tag.");
        }

        column.setSensitivityTag(sensitivityTag.toUpperCase());

        datasetColumnRepository.save(column);

    }
}