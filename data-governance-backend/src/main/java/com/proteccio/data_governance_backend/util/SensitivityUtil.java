package com.proteccio.data_governance_backend.util;

public class SensitivityUtil {

    private SensitivityUtil() {
    }

    public static String detectSensitivity(String columnName) {

        if (columnName == null) {
            return "PUBLIC";
        }

        String name = columnName.toLowerCase();

        if (name.contains("email")) {
            return "PII";
        }

        if (name.contains("phone")
                || name.contains("mobile")
                || name.contains("contact")) {
            return "PII";
        }

        if (name.contains("name")) {
            return "PERSONAL";
        }

        if (name.contains("salary")
                || name.contains("income")) {
            return "CONFIDENTIAL";
        }

        if (name.contains("aadhaar")
                || name.contains("pan")
                || name.contains("passport")) {
            return "HIGHLY_CONFIDENTIAL";
        }

        return "PUBLIC";
    }
}