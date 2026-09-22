package com.cybershield.specification;

import com.cybershield.entity.User;
import com.cybershield.enums.AccountStatus;
import com.cybershield.enums.RoleName;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class UserSpecification {

    public static Specification<User> filterUsers(
            String search,
            RoleName role,
            AccountStatus status
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(search)) {
                String searchPattern = "%" + search.toLowerCase().trim() + "%";
                Predicate nameLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("fullName")), searchPattern);
                Predicate emailLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchPattern);
                Predicate phoneLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("phone")), searchPattern);
                predicates.add(criteriaBuilder.or(nameLike, emailLike, phoneLike));
            }

            if (role != null) {
                predicates.add(criteriaBuilder.equal(root.get("role").get("name"), role));
            }

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("accountStatus"), status));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
