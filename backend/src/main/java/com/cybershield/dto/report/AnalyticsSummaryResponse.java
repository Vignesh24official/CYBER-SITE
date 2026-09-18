package com.cybershield.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsSummaryResponse {

    private long totalIncidents;
    private long newIncidents;
    private long underInvestigation;
    private long highRiskIncidents;
    private long criticalIncidents;
    private long resolvedIncidents;
    private double averageResolutionTimeHours;

    private Map<String, Long> statusBreakdown;
    private Map<String, Long> severityBreakdown;
    private Map<String, Long> categoryBreakdown;
}
