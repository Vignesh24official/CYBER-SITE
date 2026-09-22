package com.cybershield.controller;

import com.cybershield.dto.common.ApiResponse;
import com.cybershield.dto.common.PageResponse;
import com.cybershield.dto.complaint.ComplaintResponse;
import com.cybershield.dto.complaint.ComplaintSummaryResponse;
import com.cybershield.dto.complaint.StatusUpdateRequest;
import com.cybershield.dto.investigation.InvestigationNoteRequest;
import com.cybershield.service.ComplaintService;
import com.cybershield.service.InvestigationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/v1/investigator", "/api/v1/coordinator"})
@PreAuthorize("hasAnyRole('COORDINATOR', 'INVESTIGATOR', 'ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Coordinator & Investigator API", description = "Endpoints for coordinator and investigator case management, notes, findings, and evidence inspection")
public class InvestigatorController {

    private final ComplaintService complaintService;
    private final InvestigationService investigationService;

    @GetMapping("/cases")
    @Operation(summary = "Get paginated list of cases assigned to current investigator")
    public ResponseEntity<ApiResponse<PageResponse<ComplaintSummaryResponse>>> getAssignedCases(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        PageResponse<ComplaintSummaryResponse> response = complaintService.getInvestigatorAssignedCases(page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/cases/{publicId}")
    @Operation(summary = "Get assigned case details for investigator")
    public ResponseEntity<ApiResponse<ComplaintResponse>> getCaseDetail(@PathVariable String publicId) {
        ComplaintResponse response = complaintService.getComplaintByPublicId(publicId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/cases/{publicId}/notes")
    @Operation(summary = "Add investigation note, finding, action taken, or recommendation")
    public ResponseEntity<ApiResponse<ComplaintResponse.InvestigationNoteResponse>> addNote(
            @PathVariable String publicId,
            @Valid @RequestBody InvestigationNoteRequest request
    ) {
        ComplaintResponse.InvestigationNoteResponse response = investigationService.addNote(publicId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response, "Investigation note added successfully"));
    }

    @PostMapping("/cases/{publicId}/request-info")
    @Operation(summary = "Request additional information from victim/reporter")
    public ResponseEntity<ApiResponse<ComplaintResponse>> requestInfo(
            @PathVariable String publicId,
            @RequestBody Map<String, String> body
    ) {
        String notes = body.getOrDefault("notes", "Please provide additional details requested by investigator");
        ComplaintResponse response = complaintService.requestAdditionalInformation(publicId, notes);
        return ResponseEntity.ok(ApiResponse.ok(response, "Information requested from user"));
    }

    @PutMapping("/cases/{publicId}/status")
    @Operation(summary = "Update investigation case status")
    public ResponseEntity<ApiResponse<ComplaintResponse>> updateStatus(
            @PathVariable String publicId,
            @Valid @RequestBody StatusUpdateRequest request
    ) {
        ComplaintResponse response = complaintService.updateStatus(publicId, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Case status updated successfully"));
    }
}
