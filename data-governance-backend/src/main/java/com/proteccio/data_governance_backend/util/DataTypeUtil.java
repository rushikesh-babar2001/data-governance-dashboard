package com.proteccio.data_governance_backend.util;

public class DataTypeUtil {

    private DataTypeUtil() {
    }

    public static String detectDataType(String value) {

        if (value == null || value.trim().isEmpty()) {
            return "STRING";
        }

        value = value.trim();

        // Email
        if (value.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            return "EMAIL";
        }

        // Integer / Long
        if (value.matches("-?\\d+")) {

            if (value.length() >= 10) {
                return "LONG";
            }

            return "INTEGER";
        }

        // Decimal
        if (value.matches("-?\\d+\\.\\d+")) {
            return "DECIMAL";
        }

        // Boolean
        if (value.equalsIgnoreCase("true")
                || value.equalsIgnoreCase("false")) {
            return "BOOLEAN";
        }

        return "STRING";
    }
}