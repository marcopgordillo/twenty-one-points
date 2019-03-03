package org.jhipster.health.web.rest;

import io.github.jhipster.web.util.ResponseUtil;
import io.micrometer.core.annotation.Timed;
import org.jhipster.health.domain.BloodPressure;
import org.jhipster.health.repository.UserRepository;
import org.jhipster.health.security.AuthoritiesConstants;
import org.jhipster.health.security.SecurityUtils;
import org.jhipster.health.service.BloodPressureService;
import org.jhipster.health.web.rest.errors.BadRequestAlertException;
import org.jhipster.health.web.rest.util.HeaderUtil;
import org.jhipster.health.web.rest.util.PaginationUtil;
import org.jhipster.health.web.rest.vm.BloodPressureByPeriod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing BloodPressure.
 */
@RestController
@RequestMapping("/api")
public class BloodPressureResource {

    private final Logger log = LoggerFactory.getLogger(BloodPressureResource.class);

    private static final String ENTITY_NAME = "bloodPressure";

    private final BloodPressureService bloodPressureService;
    private final UserRepository userRepository;

    public BloodPressureResource(BloodPressureService bloodPressureService, UserRepository userRepository) {
        this.bloodPressureService = bloodPressureService;
        this.userRepository = userRepository;
    }

    /**
     * POST  /blood-pressures : Create a new bloodPressure.
     *
     * @param bloodPressure the bloodPressure to create
     * @return the ResponseEntity with status 201 (Created) and with body the new bloodPressure, or with status 400 (Bad Request) if the bloodPressure has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/blood-pressures")
    public ResponseEntity<?> createBloodPressure(@Valid @RequestBody BloodPressure bloodPressure) throws URISyntaxException {
        log.debug("REST request to save BloodPressure : {}", bloodPressure);
        if (bloodPressure.getId() != null) {
            throw new BadRequestAlertException("A new bloodPressure cannot already have an ID", ENTITY_NAME, "idexists");
        }

        if (bloodPressure.getUser() != null &&
            !bloodPressure.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }

        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            log.debug("No user passed in, using current user: {}", SecurityUtils.getCurrentUserLogin());
            bloodPressure.setUser(userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin().orElse(null)).orElse(null));
        }

        BloodPressure result = bloodPressureService.save(bloodPressure);
        return ResponseEntity.created(new URI("/api/blood-pressures/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /blood-pressures : Updates an existing bloodPressure.
     *
     * @param bloodPressure the bloodPressure to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated bloodPressure,
     * or with status 400 (Bad Request) if the bloodPressure is not valid,
     * or with status 500 (Internal Server Error) if the bloodPressure couldn't be updated
     */
    @PutMapping("/blood-pressures")
    public ResponseEntity<?> updateBloodPressure(@Valid @RequestBody BloodPressure bloodPressure) {
        log.debug("REST request to update BloodPressure : {}", bloodPressure);
        if (bloodPressure.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        if (bloodPressure.getUser() != null &&
            !bloodPressure.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }

        BloodPressure result = bloodPressureService.save(bloodPressure);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, bloodPressure.getId().toString()))
            .body(result);
    }

    /**
     * GET  /blood-pressures : get all the bloodPressures.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of bloodPressures in body
     */
    @GetMapping("/blood-pressures")
    public ResponseEntity<List<BloodPressure>> getAllBloodPressures(Pageable pageable) {
        log.debug("REST request to get a page of BloodPressures");

        Page<BloodPressure> page;

        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            page = bloodPressureService.findAllByOrderByDateDesc(pageable);
        } else {
            page = bloodPressureService.findByUserIsCurrentUser(pageable);
        }

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/blood-pressures");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /blood-pressures/:id : get the "id" bloodPressure.
     *
     * @param id the id of the bloodPressure to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the bloodPressure, or with status 404 (Not Found)
     */
    @GetMapping("/blood-pressures/{id}")
    public ResponseEntity<?> getBloodPressure(@PathVariable Long id) {
        log.debug("REST request to get BloodPressure : {}", id);
        Optional<BloodPressure> bloodPressure = bloodPressureService.findOne(id);

        if (bloodPressure.isPresent() && bloodPressure.get().getUser() != null &&
            !bloodPressure.get().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }

        return ResponseUtil.wrapOrNotFound(bloodPressure);
    }

    /**
     * DELETE  /blood-pressures/:id : delete the "id" bloodPressure.
     *
     * @param id the id of the bloodPressure to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/blood-pressures/{id}")
    public ResponseEntity<?> deleteBloodPressure(@PathVariable Long id) {
        log.debug("REST request to delete BloodPressure : {}", id);

        Optional<BloodPressure> bloodPressure = bloodPressureService.findOne(id);
        if (bloodPressure.isPresent() && bloodPressure.get().getUser() != null &&
            !bloodPressure.get().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }

        bloodPressureService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/blood-pressures?query=:query : search for the bloodPressure corresponding
     * to the query.
     *
     * @param query the query of the bloodPressure search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/blood-pressures")
    public ResponseEntity<List<BloodPressure>> searchBloodPressures(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of BloodPressures for query {}", query);

        Page<BloodPressure> page = bloodPressureService.search(query, pageable);

        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/blood-pressures");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /bp-by-days : get all the blood pressure readings by last x days.
     */
    @RequestMapping(value = "/bp-by-days/{days}")
    @Timed
    public ResponseEntity<BloodPressureByPeriod> getByDays(@PathVariable int days) {
        BloodPressureByPeriod response = new BloodPressureByPeriod("Last " + days + " Days", bloodPressureService.findByDaysCurrentUser(days));
        return ResponseEntity.ok(response);
    }

    /**
     * GET  /bp-by-month : get all the blood pressure readings for a particular month.
     */
    @GetMapping("/bp-by-month/{date}")
    @Timed
    public ResponseEntity<BloodPressureByPeriod> getByMonth(@PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth date) {
        LocalDate firstDay = date.atDay(1);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");
        String yearAndMonth = fmt.format(firstDay);

        BloodPressureByPeriod response = new BloodPressureByPeriod(yearAndMonth, bloodPressureService.findBpByMonth(date));
        return ResponseEntity.ok(response);
    }
}
