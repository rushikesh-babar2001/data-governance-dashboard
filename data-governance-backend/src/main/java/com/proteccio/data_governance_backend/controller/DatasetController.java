package com.proteccio.data_governance_backend.controller;

import com.proteccio.data_governance_backend.dto.UpdateSensitivityRequest;
import com.proteccio.data_governance_backend.entity.Dataset;
import com.proteccio.data_governance_backend.entity.DatasetColumn;
import com.proteccio.data_governance_backend.service.DatasetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/datasets")
@CrossOrigin(origins = "http://localhost:5173")
public class DatasetController {

    private final DatasetService datasetService;

    public DatasetController(DatasetService datasetService) {
        this.datasetService = datasetService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadDataset(
            @RequestParam("file") MultipartFile file) {

        String message = datasetService.uploadDataset(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    @GetMapping
    public ResponseEntity<List<Dataset>> getAllDatasets() {

        return ResponseEntity.ok(datasetService.getAllDatasets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dataset> getDatasetById(@PathVariable Long id) {

        return ResponseEntity.ok(datasetService.getDatasetById(id));
    }

    @GetMapping("/{id}/columns")
    public ResponseEntity<List<DatasetColumn>> getDatasetColumns(
            @PathVariable Long id) {

        return ResponseEntity.ok(datasetService.getDatasetColumns(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDataset(@PathVariable Long id) {

        datasetService.deleteDataset(id);

        return ResponseEntity.ok("Dataset deleted successfully.");
    }

    @PutMapping("/columns/{columnId}/sensitivity")
    public ResponseEntity<String> updateSensitivity(
            @PathVariable Long columnId,
            @RequestBody UpdateSensitivityRequest request) {

        datasetService.updateSensitivity(
                columnId,
                request.getSensitivityTag());

        return ResponseEntity.ok("Sensitivity updated successfully.");
    }
}