package com.cybershield.service;

import com.cybershield.dto.common.PageResponse;
import com.cybershield.dto.complaint.*;
import com.cybershield.enums.ComplaintStatus;
import com.cybershield.enums.ThreatSeverity;

import java.time.LocalDateTime;

public interface ComplaintService {
    ComplaintResponse createComplaint(ComplaintCreateRequest request);
    ComplaintResponse getComplaintByPublicId(String publicId);
    PageResponse<ComplaintSummaryResponse> getUserComplaints(int page, int size);
    PageResponse<ComplaintSummaryResponse> getFilteredComplaints(
            String search, String category, String threatType, ThreatSeverity severity,
            ComplaintStatus status, LocalDateTime fromDate, LocalDateTime toDate, Long investigatorId,
            int page, int size, String sortBy, String sortDir
    );
    PageResponse<ComplaintSummaryResponse> getInvestigatorAssignedCases(int page, int size);
    ComplaintResponse updateStatus(String publicId, StatusUpdateRequest request);
    ComplaintResponse assignInvestigator(String publicId, AssignmentRequest request);
    ComplaintResponse requestAdditionalInformation(String publicId, String requestNotes);
    ComplaintResponse provideAdditionalInformation(String publicId, InfoResponseRequest request);
}
