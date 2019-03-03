package org.jhipster.health.service.impl;

import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.jhipster.health.domain.Point;
import org.jhipster.health.repository.PointRepository;
import org.jhipster.health.repository.search.PointSearchRepository;
import org.jhipster.health.security.AuthoritiesConstants;
import org.jhipster.health.security.SecurityUtils;
import org.jhipster.health.service.PointService;
import org.jhipster.health.web.rest.vm.PointsPerMonth;
import org.jhipster.health.web.rest.vm.PointsPerWeek;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.matchQuery;
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

        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery().must(queryStringQuery(query));
        if (SecurityUtils.isAuthenticated() && !SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            queryBuilder = queryBuilder.filter(matchQuery("user.login",
                SecurityUtils.getCurrentUserLogin().orElse("")));
        }

        return pointSearchRepository.search(queryBuilder, pageable);    }

    @Override
    @Transactional(readOnly = true)
    public Page<Point> findAllByOrderByDateDesc(Pageable pageable) {
        return pointRepository.findAllByOrderByDateDesc(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Point> findByUserIsCurrentUser(Pageable pageable) {
        return pointRepository.findByUserIsCurrentUser(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Point> findAllByDateBetweenAndUserLogin(LocalDate startOfWeek, LocalDate endOfWeek, String currentUserLogin) {
        return pointRepository.findAllByDateBetweenAndUserLogin(startOfWeek, endOfWeek, currentUserLogin);
    }

    @Override
    @Transactional(readOnly = true)
    public PointsPerMonth findPointsByMonth(YearMonth yearWithMonth) {
        // Get last day of the month
        LocalDate endOfMonth = yearWithMonth.atEndOfMonth();

        List<Point> points = pointRepository.findAllByDateBetweenAndUserLogin(yearWithMonth.atDay(1), endOfMonth, SecurityUtils.getCurrentUserLogin().orElse(null));

        return new PointsPerMonth(yearWithMonth, points);
    }

    @Override
    @Transactional(readOnly = true)
    public PointsPerWeek findPointsThisWeek(String timezone) {
        // Get current date (with timezone if passed in)
        LocalDate now = LocalDate.now();
        if (timezone != null) {
            now = LocalDate.now(ZoneId.of(timezone));
        }

        // Get first day of week
        LocalDate startOfWeek = now.with(DayOfWeek.MONDAY);
        // Get last day of week
        LocalDate endOfWeek = now.with(DayOfWeek.SUNDAY);
        log.debug("Looking for points between: {} and {}", startOfWeek, endOfWeek);

        List<Point> points = findAllByDateBetweenAndUserLogin(startOfWeek, endOfWeek, SecurityUtils.getCurrentUserLogin().orElse(null));

        return calculatePoints(startOfWeek, points);
    }

    @Override
    @Transactional(readOnly = true)
    public PointsPerWeek findPointsByWeek(LocalDate date) {
        // Get first and last days of week
        LocalDate startOfWeek = date.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = date.with(DayOfWeek.SUNDAY);
        List<Point> points = pointRepository.findAllByDateBetweenAndUserLogin(startOfWeek, endOfWeek, SecurityUtils.getCurrentUserLogin().orElse(null));

        return calculatePoints(startOfWeek, points);
    }

    private PointsPerWeek calculatePoints(LocalDate startOfWeek, List<Point> points) {
        Integer numPoints = points.stream()
            .mapToInt(p -> p.getExercise() + p.getMeals() + p.getAlcohol())
            .sum();

        return new PointsPerWeek(startOfWeek, numPoints);
    }
}
