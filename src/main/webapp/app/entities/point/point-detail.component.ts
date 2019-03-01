import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPoint } from 'app/shared/model/point.model';

@Component({
    selector: 'jhi-point-detail',
    templateUrl: './point-detail.component.html'
})
export class PointDetailComponent implements OnInit {
    point: IPoint;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ point }) => {
            this.point = point;
        });
    }

    previousState() {
        window.history.back();
    }
}
