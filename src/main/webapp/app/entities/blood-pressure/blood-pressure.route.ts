import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BloodPressure } from 'app/shared/model/blood-pressure.model';
import { BloodPressureService } from './blood-pressure.service';
import { BloodPressureComponent } from './blood-pressure.component';
import { BloodPressureDetailComponent } from './blood-pressure-detail.component';
import { BloodPressureUpdateComponent } from './blood-pressure-update.component';
import { BloodPressureDeletePopupComponent } from './blood-pressure-delete-dialog.component';
import { IBloodPressure } from 'app/shared/model/blood-pressure.model';

@Injectable({ providedIn: 'root' })
export class BloodPressureResolve implements Resolve<IBloodPressure> {
    constructor(private service: BloodPressureService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IBloodPressure> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<BloodPressure>) => response.ok),
                map((bloodPressure: HttpResponse<BloodPressure>) => bloodPressure.body)
            );
        }
        return of(new BloodPressure());
    }
}

export const bloodPressureRoute: Routes = [
    {
        path: '',
        component: BloodPressureComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.bloodPressure.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: BloodPressureDetailComponent,
        resolve: {
            bloodPressure: BloodPressureResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.bloodPressure.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: BloodPressureUpdateComponent,
        resolve: {
            bloodPressure: BloodPressureResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.bloodPressure.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: BloodPressureUpdateComponent,
        resolve: {
            bloodPressure: BloodPressureResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.bloodPressure.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const bloodPressurePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: BloodPressureDeletePopupComponent,
        resolve: {
            bloodPressure: BloodPressureResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.bloodPressure.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
