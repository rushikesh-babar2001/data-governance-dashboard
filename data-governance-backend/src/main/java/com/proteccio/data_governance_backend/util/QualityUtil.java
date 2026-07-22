package com.proteccio.data_governance_backend.util;

import org.apache.commons.csv.CSVRecord;

import java.util.List;

public class QualityUtil {

    private QualityUtil() {
    }

    // Missing %
    public static double calculateMissingPercentage(List<CSVRecord> records,
                                                    String columnName) {

        if (records == null || records.isEmpty()) {
            return 0.0;
        }

        int missing = 0;

        for (CSVRecord record : records) {

            String value = record.get(columnName);

            if (value == null || value.trim().isEmpty()) {
                missing++;
            }
        }

        return (missing * 100.0) / records.size();
    }

    // Invalid %
    public static double calculateInvalidPercentage(List<CSVRecord> records,
                                                    String columnName,
                                                    String dataType) {

        if (records == null || records.isEmpty()) {
            return 0.0;
        }

        int invalid = 0;

        for (CSVRecord record : records) {

            String value = record.get(columnName);

            if (!ValidationUtil.isValid(dataType, value)) {
                invalid++;
            }
        }

        return (invalid * 100.0) / records.size();
    }

    // Quality Score
    public static double calculateQualityScore(double totalMissing,
                                               int totalColumns) {

        if (totalColumns == 0) {
            return 100.0;
        }

        double avgMissing = totalMissing / totalColumns;

        return Math.max(0, 100 - avgMissing);
    }

    // Trust Score
    public static double calculateTrustScore(double totalInvalid,
                                             int totalColumns) {

        if (totalColumns == 0) {
            return 100.0;
        }

        double avgInvalid = totalInvalid / totalColumns;

        return Math.max(0, 100 - avgInvalid);
    }

    // Value Score
    public static double calculateValueScore(int importantColumns,
                                             int totalColumns) {

        if (totalColumns == 0) {
            return 0.0;
        }

        return (importantColumns * 100.0) / totalColumns;
    }
}