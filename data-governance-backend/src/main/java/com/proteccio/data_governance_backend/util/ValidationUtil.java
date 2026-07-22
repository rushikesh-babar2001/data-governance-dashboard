package com.proteccio.data_governance_backend.util;

public class ValidationUtil {

    private ValidationUtil() {
    }

    public static boolean isValid(String dataType, String value) {

        if (value == null || value.trim().isEmpty()) {
            return true;
        }

        value = value.trim();

        switch (dataType) {

            case "EMAIL":
                return value.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

            case "INTEGER":
                return value.matches("-?\\d+");

            case "LONG":
                return value.matches("\\d{10,}");

            case "DECIMAL":
                return value.matches("-?\\d+(\\.\\d+)?");

            case "BOOLEAN":
                return value.equalsIgnoreCase("true")
                        || value.equalsIgnoreCase("false");

            default:
                return true;
        }
    }

}