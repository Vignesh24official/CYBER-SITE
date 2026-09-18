package com.cybershield.util;

import java.time.Year;

public class ComplaintNumberGenerator {

    public static String generate(Long sequenceId) {
        int year = Year.now().getValue();
        return String.format("CS-%d-%06d", year, sequenceId);
    }
}
