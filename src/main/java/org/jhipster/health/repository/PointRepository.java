package org.jhipster.health.repository;

import org.jhipster.health.domain.Point;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Point entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PointRepository extends JpaRepository<Point, Long> {

    @Query("select point from Point point where point.login.login = ?#{principal.username}")
    List<Point> findByLoginIsCurrentUser();

}
