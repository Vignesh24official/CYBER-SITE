package com.cybershield.service.impl;

import com.cybershield.dto.common.PageResponse;
import com.cybershield.dto.complaint.*;
import com.cybershield.dto.user.UserDto;
import com.cybershield.entity.*;
import com.cybershield.enums.*;
import com.cybershield.exception.ResourceNotFoundException;
import com.cybershield.exception.UnauthorizedAccessException;
import com.cybershield.repository.*;
import com.cybershield.security.SecurityUtils;
import com.cybershield.security.UserPrincipal;
import com.cybershield.service.AuditLogService;
import com.cybershield.service.ComplaintService;
import com.cybershield.service.NotificationService;
import com.cybershield.service.StateTransitionService;
import com.cybershield.specification.ComplaintSpecification;
import com.cybershield.util.ComplaintNumberGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final AssignmentRepository assignmentRepository;
    private final InvestigationNoteRepository investigationNoteRepository;
    private final EvidenceFileRepository evidenceFileRepository;
    private final StateTransitionService stateTransitionService;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public ComplaintResponse createComplaint(ComplaintCreateRequest request) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        User reporter = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Complaint complaint = Complaint.builder()
                .publicId(UUID.randomUUID().toString())
                .complaintNumber("CS-TEMP")
                .user(reporter)
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .category(request.getCategory().trim())
                .threatType(request.getThreatType().trim())
                .severity(ThreatSeverity.MEDIUM)
                .status(ComplaintStatus.SUBMITTED)
                .incidentDate(request.getIncidentDate())
                .location(request.getLocation())
                .financialLoss(request.getFinancialLoss() != null ? request.getFinancialLoss() : BigDecimal.ZERO)
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .suspiciousUrl(request.getSuspiciousUrl())
                .attackerInformation(request.getAttackerInformation())
                .additionalInformation(request.getAdditionalInformation())
                .build();

        Complaint savedComplaint = complaintRepository.save(complaint);
        String complaintNumber = ComplaintNumberGenerator.generate(savedComplaint.getId());
        savedComplaint.setComplaintNumber(complaintNumber);
        savedComplaint = complaintRepository.save(savedComplaint);

        ComplaintStatusHistory initialHistory = ComplaintStatusHistory.builder()
                .complaint(savedComplaint)
                .oldStatus(null)
                .newStatus(ComplaintStatus.SUBMITTED)
                .changedBy(reporter)
                .reason("Incident report submitted by user")
                .build();
        statusHistoryRepository.save(initialHistory);

        auditLogService.logAction(
                reporter, AuditAction.CREATE_COMPLAINT, "COMPLAINT", savedComplaint.getComplaintNumber(),
                "Submitted complaint " + savedComplaint.getComplaintNumber() + ": " + savedComplaint.getTitle()
        );

        notificationService.sendNotification(
                reporter, NotificationType.COMPLAINT_SUBMITTED,
                "Complaint Submitted",
                "Your incident report (" + savedComplaint.getComplaintNumber() + ") has been submitted successfully.",
                "COMPLAINT", savedComplaint.getPublicId()
        );

        return mapToComplaintResponse(savedComplaint);
    }

    @Override
    @Transactional(readOnly = true)
    public ComplaintResponse getComplaintByPublicId(String publicId) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Complaint complaint = complaintRepository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + publicId));

        verifyAccess(user, complaint);

        return mapToComplaintResponse(complaint);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ComplaintSummaryResponse> getUserComplaints(int page, int size) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Complaint> complaintPage = complaintRepository.findByUserId(currentUser.getId(), pageRequest);
        return PageResponse.from(complaintPage.map(this::mapToSummaryResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ComplaintSummaryResponse> getFilteredComplaints(
            String search, String category, String threatType, ThreatSeverity severity,
            ComplaintStatus status, LocalDateTime fromDate, LocalDateTime toDate, Long investigatorId,
            int page, int size, String sortBy, String sortDir
    ) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String sortProperty = String.format("%s", sortBy != null && !sortBy.isBlank() ? sortBy : "createdAt");
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(direction, sortProperty));

        Specification<Complaint> spec = ComplaintSpecification.filterComplaints(
                search, category, threatType, severity, status, fromDate, toDate, investigatorId
        );

        Page<Complaint> complaintPage = complaintRepository.findAll(spec, pageRequest);
        return PageResponse.from(complaintPage.map(this::mapToSummaryResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ComplaintSummaryResponse> getInvestigatorAssignedCases(int page, int size) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Complaint> complaintPage = complaintRepository.findAssignedToInvestigator(currentUser.getId(), pageRequest);
        return PageResponse.from(complaintPage.map(this::mapToSummaryResponse));
    }

    @Override
    @Transactional
    public ComplaintResponse updateStatus(String publicId, StatusUpdateRequest request) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        User actor = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Complaint complaint = complaintRepository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + publicId));

        if (request.getSeverity() != null && request.getSeverity() != complaint.getSeverity()) {
            ThreatSeverity oldSeverity = complaint.getSeverity();
            complaint.setSeverity(request.getSeverity());
            auditLogService.logAction(
                    actor, AuditAction.SEVERITY_CHANGE, "COMPLAINT", complaint.getComplaintNumber(),
                    "Changed severity from " + oldSeverity + " to " + request.getSeverity()
            );
        }

        if (request.getNewStatus() != null && request.getNewStatus() != complaint.getStatus()) {
            stateTransitionService.transitionState(complaint, request.getNewStatus(), actor, request.getReason());

            NotificationType notificationType = mapStatusToNotificationType(request.getNewStatus());
            if (notificationType != null) {
                notificationService.sendNotification(
                        complaint.getUser(), notificationType,
                        "Complaint Status Updated",
                        "Your complaint (" + complaint.getComplaintNumber() + ") status is now: " + request.getNewStatus().name(),
                        "COMPLAINT", complaint.getPublicId()
                );
            }
        }

        return mapToComplaintResponse(complaintRepository.save(complaint));
    }

    @Override
    @Transactional
    public ComplaintResponse assignInvestigator(String publicId, AssignmentRequest request) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        User admin = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        Complaint complaint = complaintRepository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + publicId));

        User investigator = userRepository.findByPublicId(request.getInvestigatorPublicId())
                .orElseThrow(() -> new ResourceNotFoundException("Investigator not found with public ID: " + request.getInvestigatorPublicId()));

        if (investigator.getRole().getName() != RoleName.ROLE_INVESTIGATOR && investigator.getRole().getName() != RoleName.ROLE_ADMIN) {
            throw new IllegalArgumentException("Assigned user must have INVESTIGATOR or ADMIN role");
        }

        assignmentRepository.findByComplaintIdAndAssignmentStatus(complaint.getId(), AssignmentStatus.ACTIVE)
                .ifPresent(existingAssignment -> {
                    existingAssignment.setAssignmentStatus(AssignmentStatus.REASSIGNED);
                    existingAssignment.setUnassignedAt(LocalDateTime.now());
                    assignmentRepository.save(existingAssignment);
                });

        ComplaintAssignment newAssignment = ComplaintAssignment.builder()
                .complaint(complaint)
                .investigator(investigator)
                .assignedBy(admin)
                .assignmentStatus(AssignmentStatus.ACTIVE)
                .build();
        assignmentRepository.save(newAssignment);

        if (complaint.getStatus() == ComplaintStatus.SUBMITTED || complaint.getStatus() == ComplaintStatus.UNDER_REVIEW || complaint.getStatus() == ComplaintStatus.VALIDATED) {
            if (complaint.getStatus() == ComplaintStatus.SUBMITTED) {
                stateTransitionService.transitionState(complaint, ComplaintStatus.UNDER_REVIEW, admin, "System auto-review prior to assignment");
            }
            if (complaint.getStatus() == ComplaintStatus.UNDER_REVIEW) {
                stateTransitionService.transitionState(complaint, ComplaintStatus.VALIDATED, admin, "Validated prior to assignment");
            }
            stateTransitionService.transitionState(complaint, ComplaintStatus.ASSIGNED, admin, "Assigned to investigator " + investigator.getFullName());
        }

        auditLogService.logAction(
                admin, AuditAction.ASSIGN_INVESTIGATOR, "COMPLAINT", complaint.getComplaintNumber(),
                "Assigned complaint to investigator: " + investigator.getEmail()
        );

        notificationService.sendNotification(
                investigator, NotificationType.INVESTIGATOR_ASSIGNED,
                "New Case Assigned",
                "You have been assigned case " + complaint.getComplaintNumber() + ": " + complaint.getTitle(),
                "COMPLAINT", complaint.getPublicId()
        );

        notificationService.sendNotification(
                complaint.getUser(), NotificationType.INVESTIGATOR_ASSIGNED,
                "Investigator Assigned",
                "An investigator (" + investigator.getFullName() + ") has been assigned to your complaint " + complaint.getComplaintNumber() + ".",
                "COMPLAINT", complaint.getPublicId()
        );

        return mapToComplaintResponse(complaintRepository.save(complaint));
    }

    @Override
    @Transactional
    public ComplaintResponse requestAdditionalInformation(String publicId, String requestNotes) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        User actor = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Complaint complaint = complaintRepository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + publicId));

        stateTransitionService.transitionState(complaint, ComplaintStatus.WAITING_FOR_INFORMATION, actor, requestNotes);

        auditLogService.logAction(
                actor, AuditAction.REQUEST_INFORMATION, "COMPLAINT", complaint.getComplaintNumber(),
                "Requested additional information from user: " + requestNotes
        );

        notificationService.sendNotification(
                complaint.getUser(), NotificationType.INFO_REQUESTED,
                "Action Required: Additional Information Requested",
                "Investigator requested additional details for your complaint " + complaint.getComplaintNumber() + ": " + requestNotes,
                "COMPLAINT", complaint.getPublicId()
        );

        return mapToComplaintResponse(complaint);
    }

    @Override
    @Transactional
    public ComplaintResponse provideAdditionalInformation(String publicId, InfoResponseRequest request) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Complaint complaint = complaintRepository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + publicId));

        if (!complaint.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("Only the original reporter can respond to information requests");
        }

        if (complaint.getStatus() != ComplaintStatus.WAITING_FOR_INFORMATION) {
            throw new IllegalStateException("Complaint is not waiting for user information");
        }

        complaint.setUserResponse(request.getResponseMessage().trim());
        complaint.setResponseProvidedAt(LocalDateTime.now());

        stateTransitionService.transitionState(complaint, ComplaintStatus.UNDER_INVESTIGATION, user, "User provided requested information");

        auditLogService.logAction(
                user, AuditAction.PROVIDE_INFORMATION, "COMPLAINT", complaint.getComplaintNumber(),
                "User provided additional information for complaint"
        );

        assignmentRepository.findByComplaintIdAndAssignmentStatus(complaint.getId(), AssignmentStatus.ACTIVE)
                .ifPresent(assignment -> {
                    notificationService.sendNotification(
                            assignment.getInvestigator(), NotificationType.INFO_RECEIVED,
                            "User Responded to Info Request",
                            "User provided response for case " + complaint.getComplaintNumber(),
                            "COMPLAINT", complaint.getPublicId()
                    );
                });

        return mapToComplaintResponse(complaintRepository.save(complaint));
    }

    private void verifyAccess(User user, Complaint complaint) {
        boolean isAdmin = user.getRole().getName() == RoleName.ROLE_ADMIN;
        boolean isOwner = complaint.getUser().getId().equals(user.getId());
        boolean isInvestigator = user.getRole().getName() == RoleName.ROLE_INVESTIGATOR;

        if (!isAdmin && !isOwner && !isInvestigator) {
            throw new UnauthorizedAccessException("You are not authorized to view this complaint");
        }
    }

    private ComplaintResponse mapToComplaintResponse(Complaint complaint) {
        UserDto reporterDto = UserDto.builder()
                .publicId(complaint.getUser().getPublicId())
                .fullName(complaint.getUser().getFullName())
                .email(complaint.getUser().getEmail())
                .phone(complaint.getUser().getPhone())
                .role(complaint.getUser().getRole().getName().name())
                .accountStatus(complaint.getUser().getAccountStatus())
                .createdAt(complaint.getUser().getCreatedAt())
                .build();

        UserDto investigatorDto = assignmentRepository.findByComplaintIdAndAssignmentStatus(complaint.getId(), AssignmentStatus.ACTIVE)
                .map(assignment -> UserDto.builder()
                        .publicId(assignment.getInvestigator().getPublicId())
                        .fullName(assignment.getInvestigator().getFullName())
                        .email(assignment.getInvestigator().getEmail())
                        .phone(assignment.getInvestigator().getPhone())
                        .role(assignment.getInvestigator().getRole().getName().name())
                        .accountStatus(assignment.getInvestigator().getAccountStatus())
                        .build())
                .orElse(null);

        List<ComplaintResponse.StatusHistoryResponse> historyList = statusHistoryRepository.findByComplaintIdOrderByCreatedAtAsc(complaint.getId())
                .stream()
                .map(h -> ComplaintResponse.StatusHistoryResponse.builder()
                        .oldStatus(h.getOldStatus())
                        .newStatus(h.getNewStatus())
                        .changedByName(h.getChangedBy().getFullName())
                        .reason(h.getReason())
                        .createdAt(h.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        List<ComplaintResponse.EvidenceFileResponse> evidenceList = evidenceFileRepository.findByComplaintId(complaint.getId())
                .stream()
                .map(e -> ComplaintResponse.EvidenceFileResponse.builder()
                        .id(e.getId().toString())
                        .originalFilename(e.getOriginalFilename())
                        .mimeType(e.getMimeType())
                        .fileSize(e.getFileSize())
                        .checksum(e.getChecksum())
                        .createdAt(e.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        List<ComplaintResponse.InvestigationNoteResponse> noteList = investigationNoteRepository.findByComplaintIdOrderByCreatedAtAsc(complaint.getId())
                .stream()
                .map(n -> ComplaintResponse.InvestigationNoteResponse.builder()
                        .id(n.getId())
                        .investigatorName(n.getInvestigator().getFullName())
                        .note(n.getNote())
                        .finding(n.getFinding())
                        .actionTaken(n.getActionTaken())
                        .recommendation(n.getRecommendation())
                        .createdAt(n.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return ComplaintResponse.builder()
                .publicId(complaint.getPublicId())
                .complaintNumber(complaint.getComplaintNumber())
                .reporter(reporterDto)
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .category(complaint.getCategory())
                .threatType(complaint.getThreatType())
                .severity(complaint.getSeverity())
                .status(complaint.getStatus())
                .incidentDate(complaint.getIncidentDate())
                .reportedAt(complaint.getReportedAt())
                .location(complaint.getLocation())
                .financialLoss(complaint.getFinancialLoss())
                .currency(complaint.getCurrency())
                .suspiciousUrl(complaint.getSuspiciousUrl())
                .attackerInformation(complaint.getAttackerInformation())
                .additionalInformation(complaint.getAdditionalInformation())
                .userResponse(complaint.getUserResponse())
                .responseProvidedAt(complaint.getResponseProvidedAt())
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .resolvedAt(complaint.getResolvedAt())
                .closedAt(complaint.getClosedAt())
                .assignedInvestigator(investigatorDto)
                .statusHistory(historyList)
                .evidenceFiles(evidenceList)
                .investigationNotes(noteList)
                .build();
    }

    private ComplaintSummaryResponse mapToSummaryResponse(Complaint complaint) {
        String investigatorName = assignmentRepository.findByComplaintIdAndAssignmentStatus(complaint.getId(), AssignmentStatus.ACTIVE)
                .map(a -> a.getInvestigator().getFullName())
                .orElse("Unassigned");

        return ComplaintSummaryResponse.builder()
                .publicId(complaint.getPublicId())
                .complaintNumber(complaint.getComplaintNumber())
                .title(complaint.getTitle())
                .category(complaint.getCategory())
                .threatType(complaint.getThreatType())
                .severity(complaint.getSeverity())
                .status(complaint.getStatus())
                .financialLoss(complaint.getFinancialLoss())
                .currency(complaint.getCurrency())
                .incidentDate(complaint.getIncidentDate())
                .reportedAt(complaint.getReportedAt())
                .reporterName(complaint.getUser().getFullName())
                .assignedInvestigatorName(investigatorName)
                .build();
    }

    private NotificationType mapStatusToNotificationType(ComplaintStatus status) {
        return switch (status) {
            case UNDER_REVIEW -> NotificationType.COMPLAINT_REVIEWED;
            case VALIDATED -> NotificationType.COMPLAINT_VALIDATED;
            case REJECTED -> NotificationType.COMPLAINT_REJECTED;
            case RESOLVED -> NotificationType.COMPLAINT_RESOLVED;
            case CLOSED -> NotificationType.COMPLAINT_CLOSED;
            default -> NotificationType.STATUS_CHANGED;
        };
    }
}
