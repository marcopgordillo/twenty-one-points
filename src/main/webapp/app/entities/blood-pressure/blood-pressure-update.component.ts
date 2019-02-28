import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IBloodPressure } from 'app/shared/model/blood-pressure.model';
import { BloodPressureService } from './blood-pressure.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-blood-pressure-update',
    templateUrl: './blood-pressure-update.component.html'
})
export class BloodPressureUpdateComponent implements OnInit {
    bloodPressure: IBloodPressure;
    isSaving: boolean;

    users: IUser[];
    timestamp: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected bloodPressureService: BloodPressureService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ bloodPressure }) => {
            this.bloodPressure = bloodPressure;
            this.timestamp = this.bloodPressure.timestamp != null ? this.bloodPressure.timestamp.format(DATE_TIME_FORMAT) : null;
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
        this.bloodPressure.timestamp = this.timestamp != null ? moment(this.timestamp, DATE_TIME_FORMAT) : null;
        if (this.bloodPressure.id !== undefined) {
            this.subscribeToSaveResponse(this.bloodPressureService.update(this.bloodPressure));
        } else {
            this.subscribeToSaveResponse(this.bloodPressureService.create(this.bloodPressure));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IBloodPressure>>) {
        result.subscribe((res: HttpResponse<IBloodPressure>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
