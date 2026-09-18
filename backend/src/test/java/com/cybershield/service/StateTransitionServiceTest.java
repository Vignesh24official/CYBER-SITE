package com.cybershield.service;

import com.cybershield.entity.Complaint;
import com.cybershield.entity.User;
import com.cybershield.enums.ComplaintStatus;
import com.cybershield.exception.InvalidStateTransitionException;
import com.cybershield.repository.ComplaintRepository;
import com.cybershield.repository.StatusHistoryRepository;
import com.cybershield.service.impl.StateTransitionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StateTransitionServiceTest {

    @Mock
    private ComplaintRepository complaintRepository;

    @Mock
    private StatusHistoryRepository statusHistoryRepository;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private StateTransitionServiceImpl stateTransitionService;

    private Complaint complaint;
    private User actor;

    @BeforeEach
    void setUp() {
        actor = User.builder().id(1L).email("admin@cybershield.org").build();
        complaint = Complaint.builder()
                .id(10L)
                .complaintNumber("CS-2026-000001")
                .status(ComplaintStatus.SUBMITTED)
                .build();
    }

    @Test
    @DisplayName("Should allow valid state transition: SUBMITTED -> UNDER_REVIEW")
    void transition_Valid_SubmittedToUnderReview() {
        stateTransitionService.transitionState(complaint, ComplaintStatus.UNDER_REVIEW, actor, "Initial review");

        assertEquals(ComplaintStatus.UNDER_REVIEW, complaint.getStatus());
        verify(complaintRepository, times(1)).save(complaint);
        verify(statusHistoryRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("Should throw InvalidStateTransitionException for invalid transition: SUBMITTED -> RESOLVED")
    void transition_Invalid_SubmittedToResolved_ThrowsException() {
        assertThrows(InvalidStateTransitionException.class, () ->
                stateTransitionService.transitionState(complaint, ComplaintStatus.RESOLVED, actor, "Direct resolve attempt")
        );

        assertEquals(ComplaintStatus.SUBMITTED, complaint.getStatus());
        verify(complaintRepository, never()).save(any());
    }
}
