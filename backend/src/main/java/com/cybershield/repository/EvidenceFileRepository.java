package com.cybershield.repository;

import com.cybershield.entity.EvidenceFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvidenceFileRepository extends JpaRepository<EvidenceFile, Long> {
    List<EvidenceFile> findByComplaintId(Long complaintId);
    Optional<EvidenceFile> findByStoredFilename(String storedFilename);
}
