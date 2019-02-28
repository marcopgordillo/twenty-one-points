package org.jhipster.health.repository;

import org.jhipster.health.domain.Weight;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Weight entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WeightRepository extends JpaRepository<Weight, Long> {

    @Query("select weights from Weight weights where weights.user.login = ?#{principal.username}")
    List<Weight> findByUserIsCurrentUser();

}
