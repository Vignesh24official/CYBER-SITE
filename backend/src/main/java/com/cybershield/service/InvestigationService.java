package com.cybershield.service;

import com.cybershield.dto.complaint.ComplaintResponse;
import com.cybershield.dto.investigation.InvestigationNoteRequest;

import java.util.List;

public interface InvestigationService {
    ComplaintResponse.InvestigationNoteResponse addNote(String complaintPublicId, InvestigationNoteRequest request);
    List<ComplaintResponse.InvestigationNoteResponse> getNotes(String complaintPublicId);
}
