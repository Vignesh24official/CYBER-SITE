package com.cybershield.controller;

import com.cybershield.dto.common.ApiResponse;
import com.cybershield.dto.complaint.ComplaintResponse;
import com.cybershield.entity.EvidenceFile;
import com.cybershield.service.EvidenceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Evidence Management API", description = "Endpoints for uploading, downloading, and deleting incident evidence files")
public class EvidenceController {

    private final EvidenceService evidenceService;

    @PostMapping("/complaints/{publicId}/evidence")
    @Operation(summary = "Upload evidence file for a complaint")
    public ResponseEntity<ApiResponse<ComplaintResponse.EvidenceFileResponse>> uploadEvidence(
            @PathVariable String publicId,
            @RequestParam("file") MultipartFile file
    ) {
        ComplaintResponse.EvidenceFileResponse response = evidenceService.uploadEvidence(publicId, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Evidence file uploaded successfully"));
    }

    @GetMapping("/evidence/{id}")
    @Operation(summary = "Securely download or view evidence file by ID")
    public ResponseEntity<Resource> downloadEvidence(@PathVariable Long id) {
        Resource resource = evidenceService.loadEvidenceAsResource(id);
        EvidenceFile metadata = evidenceService.getEvidenceMetadata(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metadata.getMimeType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + metadata.getOriginalFilename() + "\"")
                .body(resource);
    }

    @DeleteMapping("/evidence/{id}")
    @Operation(summary = "Delete evidence file by ID")
    public ResponseEntity<ApiResponse<Void>> deleteEvidence(@PathVariable Long id) {
        evidenceService.deleteEvidence(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Evidence file deleted successfully"));
    }
}
