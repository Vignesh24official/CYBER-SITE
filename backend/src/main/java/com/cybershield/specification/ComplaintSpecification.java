package com.cybershield.specification;

import com.cybershield.entity.Complaint;
import com.cybershield.entity.ComplaintAssignment;
import com.cybershield.enums.AssignmentStatus;
import com.cybershield.enums.ComplaintStatus;
import com.cybershield.enums.ThreatSeverity;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ComplaintSpecification {

    public static Specification<Complaint> filterComplaints(
            String search,
            String category,
            String threatType,
            ThreatSeverity severity,
            ComplaintStatus status,
            LocalDateTime fromDate,
            LocalDateTime toDate,
            Long investigatorId
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(search)) {
                String searchPattern = "%" + search.toLowerCase().trim() + "%";
                Predicate titleLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchPattern);
                Predicate descLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchPattern);
                Predicate numberLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("complaintNumber")), searchPattern);
                predicates.add(criteriaBuilder.or(titleLike, descLike, numberLike));
            }

            if (StringUtils.hasText(category)) {
                predicates.add(criteriaBuilder.equal(root.get("category"), category));
            }

            if (StringUtils.hasText(threatType)) {
                predicates.add(criteriaBuilder.equal(root.get("threatType"), threatType));
            }

            if (severity != null) {
                predicates.add(criteriaBuilder.equal(root.get("severity"), severity));
            }

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            if (fromDate != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), fromDate));
            }

            if (toDate != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), toDate));
            }

            if (investigatorId != null) {
                Join<Complaint, ComplaintAssignment> assignmentJoin = root.join("assignments", JoinType.INNER);
                Predicate sameInvestigator = criteriaBuilder.equal(assignmentJoin.get("investigator").get("id"), investigatorId);
                Predicate activeAssignment = criteriaBuilder.equal(assignmentJoin.get("assignmentStatus"), AssignmentStatus.ACTIVE);
                predicates.add(criteriaBuilder.and(sameInvestigator, activeAssignment));
            }

            query.distinct(true);
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
