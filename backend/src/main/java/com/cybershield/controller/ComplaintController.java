package com.cybershield.controller;

import com.cybershield.dto.common.ApiResponse;
import com.cybershield.dto.common.PageResponse;
import com.cybershield.dto.complaint.*;
import com.cybershield.service.ComplaintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/complaints")
@RequiredArgsConstructor
@Tag(name = "Complaint API", description = "Endpoints for creating and retrieving cyber incident complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    @Operation(summary = "Submit a new cybersecurity incident complaint")
    public ResponseEntity<ApiResponse<ComplaintResponse>> createComplaint(@Valid @RequestBody ComplaintCreateRequest request) {
        ComplaintResponse response = complaintService.createComplaint(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Complaint submitted successfully"));
    }

    @GetMapping("/my-complaints")
    @Operation(summary = "Get paginated list of complaints submitted by current user")
    public ResponseEntity<ApiResponse<PageResponse<ComplaintSummaryResponse>>> getMyComplaints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<ComplaintSummaryResponse> response = complaintService.getUserComplaints(page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{publicId}")
    @Operation(summary = "Get detailed complaint information by public ID")
    public ResponseEntity<ApiResponse<ComplaintResponse>> getComplaintByPublicId(@PathVariable String publicId) {
        ComplaintResponse response = complaintService.getComplaintByPublicId(publicId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/{publicId}/info-response")
    @Operation(summary = "Provide additional information requested by investigator")
    public ResponseEntity<ApiResponse<ComplaintResponse>> provideAdditionalInformation(
            @PathVariable String publicId,
            @Valid @RequestBody InfoResponseRequest request
    ) {
        ComplaintResponse response = complaintService.provideAdditionalInformation(publicId, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Information provided successfully"));
    }
}
