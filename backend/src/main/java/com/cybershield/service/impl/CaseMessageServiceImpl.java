package com.cybershield.service.impl;

import com.cybershield.dto.chat.CaseMessageRequest;
import com.cybershield.dto.chat.CaseMessageResponse;
import com.cybershield.entity.CaseMessage;
import com.cybershield.entity.Complaint;
import com.cybershield.entity.ComplaintAssignment;
import com.cybershield.entity.User;
import com.cybershield.enums.AssignmentStatus;
import com.cybershield.enums.AuditAction;
import com.cybershield.enums.NotificationType;
import com.cybershield.enums.RoleName;
import com.cybershield.exception.ResourceNotFoundException;
import com.cybershield.exception.UnauthorizedAccessException;
import com.cybershield.repository.AssignmentRepository;
import com.cybershield.repository.CaseMessageRepository;
import com.cybershield.repository.ComplaintRepository;
import com.cybershield.repository.UserRepository;
import com.cybershield.security.SecurityUtils;
import com.cybershield.security.UserPrincipal;
import com.cybershield.service.AuditLogService;
import com.cybershield.service.CaseMessageService;
import com.cybershield.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CaseMessageServiceImpl implements CaseMessageService {

    private final CaseMessageRepository caseMessageRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final AssignmentRepository assignmentRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public List<CaseMessageResponse> getMessages(String complaintPublicId) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Complaint complaint = complaintRepository.findByPublicId(complaintPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + complaintPublicId));

        verifyAccess(complaint, user);

        List<CaseMessage> messages = caseMessageRepository.findByComplaintIdOrderByCreatedAtAsc(complaint.getId());

        // Mark messages from other parties as read
        for (CaseMessage msg : messages) {
            if (!msg.getSender().getId().equals(user.getId()) && !Boolean.TRUE.equals(msg.getIsRead())) {
                msg.setIsRead(true);
                caseMessageRepository.save(msg);
            }
        }

        return messages.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CaseMessageResponse sendMessage(String complaintPublicId, CaseMessageRequest request) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        User sender = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Complaint complaint = complaintRepository.findByPublicId(complaintPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + complaintPublicId));

        verifyAccess(complaint, sender);

        String roleLabel;
        if (sender.getId().equals(complaint.getUser().getId())) {
            roleLabel = "CITIZEN";
        } else if (sender.getRole().getName() == RoleName.ROLE_ADMIN) {
            roleLabel = "ROLE_ADMIN";
        } else if (sender.getRole().getName() == RoleName.ROLE_COORDINATOR) {
            roleLabel = "ROLE_COORDINATOR";
        } else {
            roleLabel = "ROLE_INVESTIGATOR";
        }

        CaseMessage message = CaseMessage.builder()
                .complaint(complaint)
                .sender(sender)
                .message(request.getMessage().trim())
                .senderRole(roleLabel)
                .attachmentName(request.getAttachmentName())
                .attachmentData(request.getAttachmentData())
                .isRead(false)
                .build();

        CaseMessage saved = caseMessageRepository.save(message);

        // Send notifications
        if (roleLabel.equals("CITIZEN")) {
            // Notify assigned investigator or admins
            assignmentRepository.findByComplaintIdAndAssignmentStatus(complaint.getId(), AssignmentStatus.ACTIVE)
                    .ifPresent(assignment -> notificationService.sendNotification(
                            assignment.getInvestigator(),
                            NotificationType.NEW_CASE_MESSAGE,
                            "New Message from Citizen",
                            "Citizen " + sender.getFullName() + " posted in case " + complaint.getComplaintNumber() + ": " + truncate(message.getMessage(), 60),
                            "COMPLAINT",
                            complaint.getPublicId()
                    ));
        } else {
            // Notify citizen
            notificationService.sendNotification(
                    complaint.getUser(),
                    NotificationType.NEW_CASE_MESSAGE,
                    "New Message from Investigator",
                    "Officer " + sender.getFullName() + " sent an update on your case " + complaint.getComplaintNumber() + ": " + truncate(message.getMessage(), 60),
                    "COMPLAINT",
                    complaint.getPublicId()
            );
        }

        auditLogService.logAction(
                sender,
                AuditAction.CREATE_INVESTIGATION_NOTE,
                "COMPLAINT_CHAT",
                complaint.getComplaintNumber(),
                "Sent chat message in case " + complaint.getComplaintNumber()
        );

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(String complaintPublicId) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        Complaint complaint = complaintRepository.findByPublicId(complaintPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + complaintPublicId));

        return caseMessageRepository.countByComplaintIdAndSenderIdNotAndIsReadFalse(complaint.getId(), currentUser.getId());
    }

    private void verifyAccess(Complaint complaint, User user) {
        boolean isReporter = complaint.getUser().getId().equals(user.getId());
        boolean isStaff = user.getRole().getName() == RoleName.ROLE_ADMIN
                || user.getRole().getName() == RoleName.ROLE_INVESTIGATOR
                || user.getRole().getName() == RoleName.ROLE_COORDINATOR;

        if (!isReporter && !isStaff) {
            throw new UnauthorizedAccessException("You are not authorized to access communications for this complaint");
        }
    }

    private CaseMessageResponse mapToResponse(CaseMessage m) {
        return CaseMessageResponse.builder()
                .id(m.getId())
                .senderId(m.getSender().getId())
                .senderName(m.getSender().getFullName())
                .senderEmail(m.getSender().getEmail())
                .senderRole(m.getSenderRole())
                .message(m.getMessage())
                .attachmentName(m.getAttachmentName())
                .attachmentData(m.getAttachmentData())
                .isRead(m.getIsRead())
                .createdAt(m.getCreatedAt())
                .build();
    }

    private String truncate(String text, int max) {
        if (text == null) return "";
        return text.length() <= max ? text : text.substring(0, max) + "...";
    }
}
