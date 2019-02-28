package org.jhipster.health.service.impl;

import org.jhipster.health.domain.Point;
import org.jhipster.health.repository.PointRepository;
import org.jhipster.health.repository.search.PointSearchRepository;
import org.jhipster.health.service.PointService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * Service Implementation for managing Point.
 */
@Service
@Transactional
public class PointServiceImpl implements PointService {

    private final Logger log = LoggerFactory.getLogger(PointServiceImpl.class);

    private final PointRepository pointRepository;

    private final PointSearchRepository pointSearchRepository;

    public PointServiceImpl(PointRepository pointRepository, PointSearchRepository pointSearchRepository) {
        this.pointRepository = pointRepository;
        this.pointSearchRepository = pointSearchRepository;
    }

    /**
     * Save a point.
     *
     * @param point the entity to save
     * @return the persisted entity
     */
    @Override
    public Point save(Point point) {
        log.debug("Request to save Point : {}", point);
        Point result = pointRepository.save(point);
        pointSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the points.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Point> findAll(Pageable pageable) {
        log.debug("Request to get all Points");
        return pointRepository.findAll(pageable);
    }


    /**
     * Get one point by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Point> findOne(Long id) {
        log.debug("Request to get Point : {}", id);
        return pointRepository.findById(id);
    }

    /**
     * Delete the point by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Point : {}", id);
        pointRepository.deleteById(id);
        pointSearchRepository.deleteById(id);
    }

    /**
     * Search for the point corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Point> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Points for query {}", query);
        return pointSearchRepository.search(queryStringQuery(query), pageable);    }

    @Override
    public Page<Point> findAllByOrderByDateDesc(Pageable pageable) {
        return pointRepository.findAllByOrderByDateDesc(pageable);
    }

    @Override
    public Page<Point> findByUserIsCurrentUser(Pageable pageable) {
        return pointRepository.findByUserIsCurrentUser(pageable);
    }
}
