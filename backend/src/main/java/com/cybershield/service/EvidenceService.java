package com.cybershield.service;

import com.cybershield.dto.complaint.ComplaintResponse;
import com.cybershield.entity.EvidenceFile;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface EvidenceService {
    ComplaintResponse.EvidenceFileResponse uploadEvidence(String complaintPublicId, MultipartFile file);
    Resource loadEvidenceAsResource(Long evidenceId);
    EvidenceFile getEvidenceMetadata(Long evidenceId);
    void deleteEvidence(Long evidenceId);
}
