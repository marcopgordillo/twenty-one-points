import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IPoint } from 'app/shared/model/point.model';
import { PointService } from './point.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-point-update',
    templateUrl: './point-update.component.html'
})
export class PointUpdateComponent implements OnInit {
    point: IPoint;
    isSaving: boolean;

    users: IUser[];
    dateDp: any;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected pointService: PointService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ point }) => {
            this.point = point;
        });
        this.userService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUser[]>) => response.body)
            )
            .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;

        // convert booleans to ints
        this.point.exercise = this.point.exercise ? 1 : 0;
        this.point.meals = this.point.meals ? 1 : 0;
        this.point.alcohol = this.point.alcohol ? 1 : 0;
        if (this.point.id !== undefined) {
            this.subscribeToSaveResponse(this.pointService.update(this.point));
        } else {
            this.subscribeToSaveResponse(this.pointService.create(this.point));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPoint>>) {
        result.subscribe((res: HttpResponse<IPoint>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }
}
