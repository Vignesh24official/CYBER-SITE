package com.cybershield.repository;

import com.cybershield.entity.CaseMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CaseMessageRepository extends JpaRepository<CaseMessage, Long> {
    List<CaseMessage> findByComplaintIdOrderByCreatedAtAsc(Long complaintId);
    long countByComplaintIdAndSenderIdNotAndIsReadFalse(Long complaintId, Long userId);
}
