package com.cybershield.service.impl;

import com.cybershield.dto.report.AnalyticsSummaryResponse;
import com.cybershield.entity.Complaint;
import com.cybershield.enums.ComplaintStatus;
import com.cybershield.enums.ThreatSeverity;
import com.cybershield.repository.ComplaintRepository;
import com.cybershield.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ComplaintRepository complaintRepository;

    @Override
    @Transactional(readOnly = true)
    public AnalyticsSummaryResponse getAnalyticsSummary() {
        long total = complaintRepository.count();
        long newIncidents = complaintRepository.countByStatus(ComplaintStatus.SUBMITTED);
        long underInv = complaintRepository.countByStatus(ComplaintStatus.UNDER_INVESTIGATION);
        long highRisk = complaintRepository.countBySeverity(ThreatSeverity.HIGH);
        long criticalRisk = complaintRepository.countBySeverity(ThreatSeverity.CRITICAL);
        long resolved = complaintRepository.countByStatus(ComplaintStatus.RESOLVED) + complaintRepository.countByStatus(ComplaintStatus.CLOSED);

        List<Complaint> resolvedComplaints = complaintRepository.findAll().stream()
                .filter(c -> c.getResolvedAt() != null)
                .toList();

        double avgHours = 0.0;
        if (!resolvedComplaints.isEmpty()) {
            long totalMinutes = resolvedComplaints.stream()
                    .mapToLong(c -> Duration.between(c.getReportedAt(), c.getResolvedAt()).toMinutes())
                    .sum();
            avgHours = (double) totalMinutes / (60.0 * resolvedComplaints.size());
        }

        Map<String, Long> statusMap = new HashMap<>();
        for (Object[] row : complaintRepository.countGroupedByStatus()) {
            statusMap.put(row[0].toString(), (Long) row[1]);
        }

        Map<String, Long> severityMap = new HashMap<>();
        for (Object[] row : complaintRepository.countGroupedBySeverity()) {
            severityMap.put(row[0].toString(), (Long) row[1]);
        }

        Map<String, Long> categoryMap = new HashMap<>();
        for (Object[] row : complaintRepository.countGroupedByCategory()) {
            categoryMap.put(row[0].toString(), (Long) row[1]);
        }

        return AnalyticsSummaryResponse.builder()
                .totalIncidents(total)
                .newIncidents(newIncidents)
                .underInvestigation(underInv)
                .highRiskIncidents(highRisk)
                .criticalIncidents(criticalRisk)
                .resolvedIncidents(resolved)
                .averageResolutionTimeHours(Math.round(avgHours * 10.0) / 10.0)
                .statusBreakdown(statusMap)
                .severityBreakdown(severityMap)
                .categoryBreakdown(categoryMap)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] generateComplaintsCsvReport() {
        List<Complaint> complaints = complaintRepository.findAll();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            writer.println("Complaint Number,Title,Category,Threat Type,Severity,Status,Reporter,Financial Loss,Incident Date,Reported At");

            for (Complaint c : complaints) {
                writer.printf("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%.2f,\"%s\",\"%s\"%n",
                        escapeCsv(c.getComplaintNumber()),
                        escapeCsv(c.getTitle()),
                        escapeCsv(c.getCategory()),
                        escapeCsv(c.getThreatType()),
                        c.getSeverity(),
                        c.getStatus(),
                        escapeCsv(c.getUser().getFullName()),
                        c.getFinancialLoss(),
                        c.getIncidentDate(),
                        c.getReportedAt()
                );
            }

            writer.flush();
            return out.toByteArray();
        } catch (Exception ex) {
            log.error("Failed to generate CSV report", ex);
            throw new RuntimeException("CSV report generation failed", ex);
        }
    }

    private String escapeCsv(String input) {
        if (input == null) return "";
        return input.replace("\"", "\"\"");
    }
}
