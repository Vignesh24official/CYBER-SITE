package com.cybershield.service;

import com.cybershield.entity.Complaint;
import com.cybershield.entity.User;
import com.cybershield.enums.ComplaintStatus;

public interface StateTransitionService {
    void validateTransition(ComplaintStatus currentStatus, ComplaintStatus newStatus);
    void transitionState(Complaint complaint, ComplaintStatus newStatus, User actor, String reason);
}
