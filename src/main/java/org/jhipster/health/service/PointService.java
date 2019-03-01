package org.jhipster.health.service;

import org.jhipster.health.domain.Point;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing Point.
 */
public interface PointService {

    /**
     * Save a point.
     *
     * @param point the entity to save
     * @return the persisted entity
     */
    Point save(Point point);

    /**
     * Get all the points.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<Point> findAll(Pageable pageable);


    /**
     * Get the "id" point.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<Point> findOne(Long id);

    /**
     * Delete the "id" point.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the point corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<Point> search(String query, Pageable pageable);

    Page<Point> findAllByOrderByDateDesc(Pageable pageable);

    Page<Point> findByUserIsCurrentUser(Pageable pageable);

    List<Point> findAllByDateBetweenAndUserLogin(LocalDate startOfWeek, LocalDate endOfWeek, String currentUserLogin);
}
