package org.jhipster.health.repository;

import org.jhipster.health.domain.Point;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Point entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PointRepository extends JpaRepository<Point, Long> {

    @Query("select points from Point points where points.user.login = ?#{principal.username} order by points.date desc")
    Page<Point> findByUserIsCurrentUser(Pageable pageable);

    Page<Point> findAllByOrderByDateDesc(Pageable pageable);
}
