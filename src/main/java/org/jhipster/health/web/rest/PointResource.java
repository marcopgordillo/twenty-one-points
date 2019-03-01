package org.jhipster.health.web.rest;

import io.github.jhipster.web.util.ResponseUtil;
import io.micrometer.core.annotation.Timed;
import io.swagger.annotations.ApiParam;
import org.jhipster.health.domain.Point;
import org.jhipster.health.repository.UserRepository;
import org.jhipster.health.repository.search.PointSearchRepository;
import org.jhipster.health.security.AuthoritiesConstants;
import org.jhipster.health.security.SecurityUtils;
import org.jhipster.health.service.PointService;
import org.jhipster.health.web.rest.errors.BadRequestAlertException;
import org.jhipster.health.web.rest.util.HeaderUtil;
import org.jhipster.health.web.rest.util.PaginationUtil;
import org.jhipster.health.web.rest.vm.PointsPerWeek;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Point.
 */
@RestController
@RequestMapping("/api")
public class PointResource {

    private final Logger log = LoggerFactory.getLogger(PointResource.class);

    private static final String ENTITY_NAME = "point";

    private final PointService pointService;
    private final UserRepository userRepository;
    private final PointSearchRepository pointsSearchRepository;

    public PointResource(PointService pointService, UserRepository userRepository, PointSearchRepository pointsSearchRepository) {
        this.pointService = pointService;
        this.userRepository = userRepository;
        this.pointsSearchRepository = pointsSearchRepository;
    }

    /**
     * POST  /points : Create a new point.
     *
     * @param point the point to create
     * @return the ResponseEntity with status 201 (Created) and with body the new point, or with status 400 (Bad Request) if the point has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/points")
    @Timed
    public ResponseEntity<Point> createPoint(@Valid @RequestBody Point point) throws URISyntaxException {
        log.debug("REST request to save Point : {}", point);
        if (point.getId() != null) {
            return ResponseEntity.badRequest().headers(
                HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists",
                    "A new points cannot already have an ID")).body(null);
        }

        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            log.debug("No user passed in, using current user: {}", SecurityUtils.getCurrentUserLogin());
            point.setUser(userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin().orElse(null)).orElse(null));
        }

        Point result = pointService.save(point);
        pointsSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/points/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /points : Updates an existing point.
     *
     * @param point the point to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated point,
     * or with status 400 (Bad Request) if the point is not valid,
     * or with status 500 (Internal Server Error) if the point couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/points")
    public ResponseEntity<Point> updatePoint(@Valid @RequestBody Point point) throws URISyntaxException {
        log.debug("REST request to update Point : {}", point);
        if (point.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Point result = pointService.save(point);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, point.getId().toString()))
            .body(result);
    }

    /**
     * GET  /points : get all the points.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of points in body
     */
    @GetMapping("/points")
    public ResponseEntity<List<Point>> getAllPoints(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of Points");

        Page<Point> page;

        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            page = pointService.findAllByOrderByDateDesc(pageable);
        } else {
            page = pointService.findByUserIsCurrentUser(pageable);
        }

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/points");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /points/:id : get the "id" point.
     *
     * @param id the id of the point to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the point, or with status 404 (Not Found)
     */
    @GetMapping("/points/{id}")
    public ResponseEntity<Point> getPoint(@PathVariable Long id) {
        log.debug("REST request to get Point : {}", id);
        Optional<Point> point = pointService.findOne(id);
        return ResponseUtil.wrapOrNotFound(point);
    }

    /**
     * DELETE  /points/:id : delete the "id" point.
     *
     * @param id the id of the point to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/points/{id}")
    public ResponseEntity<Void> deletePoint(@PathVariable Long id) {
        log.debug("REST request to delete Point : {}", id);
        pointService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/points?query=:query : search for the point corresponding
     * to the query.
     *
     * @param query the query of the point search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/points")
    public ResponseEntity<List<Point>> searchPoints(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Points for query {}", query);
        Page<Point> page = pointService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/points");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /points : get all the points for the current week.
     */
    @GetMapping("/points-this-week")
    @Timed
    public ResponseEntity<PointsPerWeek> getPointsThisWeek(
        @RequestParam(value="tz", required=false) String timezone) {

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

        List<Point> points =
            pointService.findAllByDateBetweenAndUserLogin(
                startOfWeek, endOfWeek, SecurityUtils.getCurrentUserLogin().orElse(null));
        return calculatePoints(startOfWeek, points);
    }

    private ResponseEntity<PointsPerWeek> calculatePoints(LocalDate startOfWeek,
                                                          List<Point> points) {
        Integer numPoints = points.stream()
            .mapToInt(p -> p.getExercise() + p.getMeals() + p.getAlcohol())
            .sum();

        PointsPerWeek count = new PointsPerWeek(startOfWeek, numPoints);
        return ResponseEntity.ok().body(count);
    }
}
