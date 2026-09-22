package com.cybershield.repository;

import com.cybershield.entity.ComplaintAssignment;
import com.cybershield.enums.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentRepository extends JpaRepository<ComplaintAssignment, Long> {
    Optional<ComplaintAssignment> findByComplaintIdAndAssignmentStatus(Long complaintId, AssignmentStatus status);
    List<ComplaintAssignment> findByComplaintIdOrderByAssignedAtDesc(Long complaintId);
    List<ComplaintAssignment> findByInvestigatorIdAndAssignmentStatus(Long investigatorId, AssignmentStatus status);
    long countByInvestigatorId(Long investigatorId);
    long countByInvestigatorIdAndAssignmentStatus(Long investigatorId, AssignmentStatus status);
}
