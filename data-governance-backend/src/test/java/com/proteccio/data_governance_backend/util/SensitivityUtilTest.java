package com.proteccio.data_governance_backend.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class SensitivityUtilTest {

    @Test
    void testEmailColumn() {
        assertEquals("PII", SensitivityUtil.detectSensitivity("Email"));
    }

    @Test
    void testSalaryColumn() {
        assertEquals("CONFIDENTIAL", SensitivityUtil.detectSensitivity("Salary"));
    }

    @Test
    void testNameColumn() {
        assertEquals("PERSONAL", SensitivityUtil.detectSensitivity("Name"));
    }

    @Test
    void testDepartmentColumn() {
        assertEquals("PUBLIC", SensitivityUtil.detectSensitivity("Department"));
    }
}