package com.cybershield.repository;

import com.cybershield.entity.Complaint;
import com.cybershield.enums.ComplaintStatus;
import com.cybershield.enums.ThreatSeverity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long>, JpaSpecificationExecutor<Complaint> {

    Optional<Complaint> findByPublicId(String publicId);
    Optional<Complaint> findByComplaintNumber(String complaintNumber);

    Page<Complaint> findByUserId(Long userId, Pageable pageable);
    List<Complaint> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT c FROM Complaint c JOIN c.assignments a WHERE a.investigator.id = :investigatorId AND a.assignmentStatus = 'ACTIVE'")
    Page<Complaint> findAssignedToInvestigator(@Param("investigatorId") Long investigatorId, Pageable pageable);

    @Query("SELECT c FROM Complaint c JOIN c.assignments a WHERE a.investigator.id = :investigatorId AND a.assignmentStatus = 'ACTIVE' AND c.publicId = :publicId")
    Optional<Complaint> findAssignedToInvestigatorByPublicId(@Param("investigatorId") Long investigatorId, @Param("publicId") String publicId);

    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, ComplaintStatus status);

    long countByStatus(ComplaintStatus status);
    long countBySeverity(ThreatSeverity severity);

    @Query("SELECT c.status, COUNT(c) FROM Complaint c GROUP BY c.status")
    List<Object[]> countGroupedByStatus();

    @Query("SELECT c.severity, COUNT(c) FROM Complaint c GROUP BY c.severity")
    List<Object[]> countGroupedBySeverity();

    @Query("SELECT c.category, COUNT(c) FROM Complaint c GROUP BY c.category")
    List<Object[]> countGroupedByCategory();
}
