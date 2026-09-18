package com.cybershield.service.impl;

import com.cybershield.dto.complaint.ComplaintResponse;
import com.cybershield.dto.investigation.InvestigationNoteRequest;
import com.cybershield.entity.Complaint;
import com.cybershield.entity.InvestigationNote;
import com.cybershield.entity.User;
import com.cybershield.enums.AuditAction;
import com.cybershield.enums.ComplaintStatus;
import com.cybershield.enums.RoleName;
import com.cybershield.exception.ResourceNotFoundException;
import com.cybershield.exception.UnauthorizedAccessException;
import com.cybershield.repository.ComplaintRepository;
import com.cybershield.repository.InvestigationNoteRepository;
import com.cybershield.repository.UserRepository;
import com.cybershield.security.SecurityUtils;
import com.cybershield.security.UserPrincipal;
import com.cybershield.service.AuditLogService;
import com.cybershield.service.InvestigationService;
import com.cybershield.service.StateTransitionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvestigationServiceImpl implements InvestigationService {

    private final InvestigationNoteRepository investigationNoteRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final StateTransitionService stateTransitionService;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public ComplaintResponse.InvestigationNoteResponse addNote(String complaintPublicId, InvestigationNoteRequest request) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        User investigator = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Complaint complaint = complaintRepository.findByPublicId(complaintPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + complaintPublicId));

        boolean isAdmin = investigator.getRole().getName() == RoleName.ROLE_ADMIN;
        boolean isInvestigator = investigator.getRole().getName() == RoleName.ROLE_INVESTIGATOR;

        if (!isAdmin && !isInvestigator) {
            throw new UnauthorizedAccessException("Only investigators and administrators can add investigation notes");
        }

        InvestigationNote note = InvestigationNote.builder()
                .complaint(complaint)
                .investigator(investigator)
                .note(request.getNote().trim())
                .finding(request.getFinding() != null ? request.getFinding().trim() : null)
                .actionTaken(request.getActionTaken() != null ? request.getActionTaken().trim() : null)
                .recommendation(request.getRecommendation() != null ? request.getRecommendation().trim() : null)
                .build();

        InvestigationNote savedNote = investigationNoteRepository.save(note);

        if (complaint.getStatus() == ComplaintStatus.ASSIGNED) {
            stateTransitionService.transitionState(complaint, ComplaintStatus.UNDER_INVESTIGATION, investigator, "Investigation started with note creation");
        }

        auditLogService.logAction(
                investigator, AuditAction.CREATE_INVESTIGATION_NOTE, "COMPLAINT", complaint.getComplaintNumber(),
                "Added investigation note to complaint " + complaint.getComplaintNumber()
        );

        return ComplaintResponse.InvestigationNoteResponse.builder()
                .id(savedNote.getId())
                .investigatorName(investigator.getFullName())
                .note(savedNote.getNote())
                .finding(savedNote.getFinding())
                .actionTaken(savedNote.getActionTaken())
                .recommendation(savedNote.getRecommendation())
                .createdAt(savedNote.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponse.InvestigationNoteResponse> getNotes(String complaintPublicId) {
        Complaint complaint = complaintRepository.findByPublicId(complaintPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + complaintPublicId));

        return investigationNoteRepository.findByComplaintIdOrderByCreatedAtAsc(complaint.getId())
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
    }
}
