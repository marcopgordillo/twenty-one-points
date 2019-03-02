package org.jhipster.health.web.rest;

import io.github.jhipster.web.util.ResponseUtil;
import io.micrometer.core.annotation.Timed;
import org.jhipster.health.domain.Weight;
import org.jhipster.health.service.WeightService;
import org.jhipster.health.web.rest.errors.BadRequestAlertException;
import org.jhipster.health.web.rest.util.HeaderUtil;
import org.jhipster.health.web.rest.util.PaginationUtil;
import org.jhipster.health.web.rest.vm.WeightByPeriod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
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
 * REST controller for managing Weight.
 */
@RestController
@RequestMapping("/api")
public class WeightResource {

    private final Logger log = LoggerFactory.getLogger(WeightResource.class);

    private static final String ENTITY_NAME = "weight";

    private final WeightService weightService;

    public WeightResource(WeightService weightService) {
        this.weightService = weightService;
    }

    /**
     * POST  /weights : Create a new weight.
     *
     * @param weight the weight to create
     * @return the ResponseEntity with status 201 (Created) and with body the new weight, or with status 400 (Bad Request) if the weight has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/weights")
    public ResponseEntity<Weight> createWeight(@Valid @RequestBody Weight weight) throws URISyntaxException {
        log.debug("REST request to save Weight : {}", weight);
        if (weight.getId() != null) {
            throw new BadRequestAlertException("A new weight cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Weight result = weightService.save(weight);
        return ResponseEntity.created(new URI("/api/weights/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /weights : Updates an existing weight.
     *
     * @param weight the weight to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated weight,
     * or with status 400 (Bad Request) if the weight is not valid,
     * or with status 500 (Internal Server Error) if the weight couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/weights")
    public ResponseEntity<Weight> updateWeight(@Valid @RequestBody Weight weight) throws URISyntaxException {
        log.debug("REST request to update Weight : {}", weight);
        if (weight.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Weight result = weightService.save(weight);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, weight.getId().toString()))
            .body(result);
    }

    /**
     * GET  /weights : get all the weights.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of weights in body
     */
    @GetMapping("/weights")
    public ResponseEntity<List<Weight>> getAllWeights(Pageable pageable) {
        log.debug("REST request to get a page of Weights");
        Page<Weight> page = weightService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/weights");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /weights/:id : get the "id" weight.
     *
     * @param id the id of the weight to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the weight, or with status 404 (Not Found)
     */
    @GetMapping("/weights/{id}")
    public ResponseEntity<Weight> getWeight(@PathVariable Long id) {
        log.debug("REST request to get Weight : {}", id);
        Optional<Weight> weight = weightService.findOne(id);
        return ResponseUtil.wrapOrNotFound(weight);
    }

    /**
     * DELETE  /weights/:id : delete the "id" weight.
     *
     * @param id the id of the weight to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/weights/{id}")
    public ResponseEntity<Void> deleteWeight(@PathVariable Long id) {
        log.debug("REST request to delete Weight : {}", id);
        weightService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/weights?query=:query : search for the weight corresponding
     * to the query.
     *
     * @param query the query of the weight search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/weights")
    public ResponseEntity<List<Weight>> searchWeights(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Weights for query {}", query);
        Page<Weight> page = weightService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/weights");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /weight-by-days : get all the weigh-ins for last x days.
     */
    @GetMapping("/weight-by-days/{days}")
    @Timed
    public ResponseEntity<WeightByPeriod> getByDays(@PathVariable Integer days) {

        WeightByPeriod response = new WeightByPeriod("Last " + days + " Days", weightService.findByDays(days));
        return ResponseEntity.ok(response);
    }

    /**
     * GET  /bp-by-days -> get all the blood pressure readings for a particular month.
     */
    @GetMapping("/weight-by-month/{date}")
    @Timed
    public ResponseEntity<WeightByPeriod> getByMonth(@PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth date) {

        LocalDate firstDay = date.atDay(1);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");
        String yearAndMonth = fmt.format(firstDay);

        WeightByPeriod response = new WeightByPeriod(yearAndMonth, weightService.findByMonth(date));
        return ResponseEntity.ok(response);
    }



}
