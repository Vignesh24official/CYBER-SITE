package com.cybershield.service.impl;

import com.cybershield.entity.Complaint;
import com.cybershield.entity.ComplaintStatusHistory;
import com.cybershield.entity.User;
import com.cybershield.enums.AuditAction;
import com.cybershield.enums.ComplaintStatus;
import com.cybershield.exception.InvalidStateTransitionException;
import com.cybershield.repository.ComplaintRepository;
import com.cybershield.repository.StatusHistoryRepository;
import com.cybershield.service.AuditLogService;
import com.cybershield.service.StateTransitionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class StateTransitionServiceImpl implements StateTransitionService {

    private final ComplaintRepository complaintRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final AuditLogService auditLogService;

    private static final Map<ComplaintStatus, Set<ComplaintStatus>> VALID_TRANSITIONS = new EnumMap<>(ComplaintStatus.class);

    static {
        VALID_TRANSITIONS.put(ComplaintStatus.SUBMITTED, Set.of(ComplaintStatus.UNDER_REVIEW));
        VALID_TRANSITIONS.put(ComplaintStatus.UNDER_REVIEW, Set.of(ComplaintStatus.VALIDATED, ComplaintStatus.REJECTED));
        VALID_TRANSITIONS.put(ComplaintStatus.VALIDATED, Set.of(ComplaintStatus.ASSIGNED));
        VALID_TRANSITIONS.put(ComplaintStatus.ASSIGNED, Set.of(ComplaintStatus.UNDER_INVESTIGATION));
        VALID_TRANSITIONS.put(ComplaintStatus.UNDER_INVESTIGATION, Set.of(ComplaintStatus.WAITING_FOR_INFORMATION, ComplaintStatus.RESOLVED));
        VALID_TRANSITIONS.put(ComplaintStatus.WAITING_FOR_INFORMATION, Set.of(ComplaintStatus.UNDER_INVESTIGATION));
        VALID_TRANSITIONS.put(ComplaintStatus.RESOLVED, Set.of(ComplaintStatus.CLOSED));
        VALID_TRANSITIONS.put(ComplaintStatus.REJECTED, Collections.emptySet());
        VALID_TRANSITIONS.put(ComplaintStatus.CLOSED, Collections.emptySet());
    }

    @Override
    public void validateTransition(ComplaintStatus currentStatus, ComplaintStatus newStatus) {
        if (currentStatus == newStatus) {
            return;
        }

        Set<ComplaintStatus> allowedNextStates = VALID_TRANSITIONS.getOrDefault(currentStatus, Collections.emptySet());
        if (!allowedNextStates.contains(newStatus)) {
            throw new InvalidStateTransitionException(
                    String.format("Cannot transition complaint status from %s to %s. Allowed transitions: %s",
                            currentStatus, newStatus, allowedNextStates)
            );
        }
    }

    @Override
    @Transactional
    public void transitionState(Complaint complaint, ComplaintStatus newStatus, User actor, String reason) {
        ComplaintStatus oldStatus = complaint.getStatus();
        validateTransition(oldStatus, newStatus);

        complaint.setStatus(newStatus);
        if (newStatus == ComplaintStatus.RESOLVED) {
            complaint.setResolvedAt(LocalDateTime.now());
        } else if (newStatus == ComplaintStatus.CLOSED) {
            complaint.setClosedAt(LocalDateTime.now());
        }

        complaintRepository.save(complaint);

        ComplaintStatusHistory history = ComplaintStatusHistory.builder()
                .complaint(complaint)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .changedBy(actor)
                .reason(reason)
                .build();
        statusHistoryRepository.save(history);

        auditLogService.logAction(
                actor,
                AuditAction.STATUS_CHANGE,
                "COMPLAINT",
                complaint.getComplaintNumber(),
                String.format("Transitioned status from %s to %s. Reason: %s", oldStatus, newStatus, reason != null ? reason : "N/A")
        );

        log.info("Complaint {} status changed from {} to {} by user {}", complaint.getComplaintNumber(), oldStatus, newStatus, actor.getEmail());
    }
}
