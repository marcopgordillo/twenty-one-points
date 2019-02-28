import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Weight } from 'app/shared/model/weight.model';
import { WeightService } from './weight.service';
import { WeightComponent } from './weight.component';
import { WeightDetailComponent } from './weight-detail.component';
import { WeightUpdateComponent } from './weight-update.component';
import { WeightDeletePopupComponent } from './weight-delete-dialog.component';
import { IWeight } from 'app/shared/model/weight.model';

@Injectable({ providedIn: 'root' })
export class WeightResolve implements Resolve<IWeight> {
    constructor(private service: WeightService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IWeight> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Weight>) => response.ok),
                map((weight: HttpResponse<Weight>) => weight.body)
            );
        }
        return of(new Weight());
    }
}

export const weightRoute: Routes = [
    {
        path: '',
        component: WeightComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.weight.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: WeightDetailComponent,
        resolve: {
            weight: WeightResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.weight.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: WeightUpdateComponent,
        resolve: {
            weight: WeightResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.weight.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: WeightUpdateComponent,
        resolve: {
            weight: WeightResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.weight.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const weightPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: WeightDeletePopupComponent,
        resolve: {
            weight: WeightResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.weight.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
