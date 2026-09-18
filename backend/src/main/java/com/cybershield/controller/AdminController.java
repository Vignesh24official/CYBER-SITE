package com.cybershield.controller;

import com.cybershield.dto.common.ApiResponse;
import com.cybershield.dto.common.PageResponse;
import com.cybershield.dto.complaint.*;
import com.cybershield.dto.user.UserDto;
import com.cybershield.entity.AuditLog;
import com.cybershield.entity.ThreatCategory;
import com.cybershield.entity.ThreatType;
import com.cybershield.enums.AccountStatus;
import com.cybershield.enums.ComplaintStatus;
import com.cybershield.enums.RoleName;
import com.cybershield.enums.ThreatSeverity;
import com.cybershield.repository.AuditLogRepository;
import com.cybershield.repository.ThreatCategoryRepository;
import com.cybershield.repository.ThreatTypeRepository;
import com.cybershield.service.ComplaintService;
import com.cybershield.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin SOC API", description = "Endpoints for Security Operations Center incident triage, user management, audit logs, and settings")
public class AdminController {

    private final ComplaintService complaintService;
    private final UserService userService;
    private final AuditLogRepository auditLogRepository;
    private final ThreatCategoryRepository categoryRepository;
    private final ThreatTypeRepository threatTypeRepository;

    @GetMapping("/complaints")
    @Operation(summary = "Get paginated, searched, and filtered complaints grid for SOC dashboard")
    public ResponseEntity<ApiResponse<PageResponse<ComplaintSummaryResponse>>> getComplaints(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String threatType,
            @RequestParam(required = false) ThreatSeverity severity,
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(required = false) Long investigatorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PageResponse<ComplaintSummaryResponse> response = complaintService.getFilteredComplaints(
                search, category, threatType, severity, status, from, to, investigatorId, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/complaints/{publicId}")
    @Operation(summary = "Get full detailed complaint view for Admin")
    public ResponseEntity<ApiResponse<ComplaintResponse>> getComplaintDetail(@PathVariable String publicId) {
        ComplaintResponse response = complaintService.getComplaintByPublicId(publicId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/complaints/{publicId}/status")
    @Operation(summary = "Update complaint status and/or severity level")
    public ResponseEntity<ApiResponse<ComplaintResponse>> updateStatus(
            @PathVariable String publicId,
            @Valid @RequestBody StatusUpdateRequest request
    ) {
        ComplaintResponse response = complaintService.updateStatus(publicId, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Status updated successfully"));
    }

    @PostMapping("/complaints/{publicId}/assign")
    @Operation(summary = "Assign complaint to investigator")
    public ResponseEntity<ApiResponse<ComplaintResponse>> assignInvestigator(
            @PathVariable String publicId,
            @Valid @RequestBody AssignmentRequest request
    ) {
        ComplaintResponse response = complaintService.assignInvestigator(publicId, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Investigator assigned successfully"));
    }

    @PostMapping("/complaints/{publicId}/request-info")
    @Operation(summary = "Request additional information from victim/reporter")
    public ResponseEntity<ApiResponse<ComplaintResponse>> requestInfo(
            @PathVariable String publicId,
            @RequestBody Map<String, String> body
    ) {
        String notes = body.getOrDefault("notes", "Please provide additional details");
        ComplaintResponse response = complaintService.requestAdditionalInformation(publicId, notes);
        return ResponseEntity.ok(ApiResponse.ok(response, "Information requested from user"));
    }

    @GetMapping("/users")
    @Operation(summary = "Get list of registered platform users")
    public ResponseEntity<ApiResponse<PageResponse<UserDto>>> getUsers(
            @RequestParam(required = false) RoleName role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        PageResponse<UserDto> response = userService.getUsers(role, page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/investigators")
    @Operation(summary = "Get list of active investigators")
    public ResponseEntity<ApiResponse<List<UserDto>>> getInvestigators() {
        List<UserDto> investigators = userService.getInvestigators();
        return ResponseEntity.ok(ApiResponse.ok(investigators));
    }

    @PutMapping("/users/{publicId}/status")
    @Operation(summary = "Update user account status (ACTIVE, SUSPENDED, LOCKED)")
    public ResponseEntity<ApiResponse<UserDto>> updateUserStatus(
            @PathVariable String publicId,
            @RequestBody Map<String, String> body
    ) {
        AccountStatus status = AccountStatus.valueOf(body.get("status"));
        UserDto user = userService.updateUserStatus(publicId, status);
        return ResponseEntity.ok(ApiResponse.ok(user, "User status updated"));
    }

    @PutMapping("/users/{publicId}/role")
    @Operation(summary = "Update user role (ROLE_USER, ROLE_INVESTIGATOR, ROLE_ADMIN)")
    public ResponseEntity<ApiResponse<UserDto>> updateUserRole(
            @PathVariable String publicId,
            @RequestBody Map<String, String> body
    ) {
        RoleName role = RoleName.valueOf(body.get("role"));
        UserDto user = userService.updateUserRole(publicId, role);
        return ResponseEntity.ok(ApiResponse.ok(user, "User role updated"));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Get paginated system audit logs")
    public ResponseEntity<ApiResponse<PageResponse<AuditLog>>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(auditLogRepository.findAll(pageRequest))));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get threat categories and threat types")
    public ResponseEntity<ApiResponse<List<ThreatCategory>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.ok(categoryRepository.findAll()));
    }

    @PostMapping("/categories")
    @Operation(summary = "Create new threat category")
    public ResponseEntity<ApiResponse<ThreatCategory>> createCategory(@RequestBody ThreatCategory category) {
        ThreatCategory saved = categoryRepository.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(saved, "Threat category created"));
    }

    @PostMapping("/categories/{categoryId}/types")
    @Operation(summary = "Add threat type under specific category")
    public ResponseEntity<ApiResponse<ThreatType>> createThreatType(
            @PathVariable Long categoryId,
            @RequestBody ThreatType threatType
    ) {
        ThreatCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        threatType.setCategory(category);
        ThreatType saved = threatTypeRepository.save(threatType);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(saved, "Threat type created"));
    }
}
