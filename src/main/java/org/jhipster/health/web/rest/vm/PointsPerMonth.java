package org.jhipster.health.web.rest.vm;

import org.jhipster.health.domain.Point;

import java.time.YearMonth;
import java.util.List;

public class PointsPerMonth {
    private YearMonth month;
    private List<Point> points;

    public PointsPerMonth(YearMonth yearWithMonth, List<Point> points) {
        this.month = yearWithMonth;
        this.points = points;
    }

    public YearMonth getMonth() {
        return month;
    }

    public void setMonth(YearMonth month) {
        this.month = month;
    }

    public List<Point> getPoints() {
        return points;
    }

    public void setPoints(List<Point> points) {
        this.points = points;
    }
}
