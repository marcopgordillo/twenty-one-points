import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPoint } from 'app/shared/model/point.model';

type EntityResponseType = HttpResponse<IPoint>;
type EntityArrayResponseType = HttpResponse<IPoint[]>;

@Injectable({ providedIn: 'root' })
export class PointService {
    public resourceUrl = SERVER_API_URL + 'api/points';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/points';

    protected static convertDateFromClient(point: IPoint): IPoint {
        return Object.assign({}, point, {
            date: point.date != null && point.date.isValid() ? point.date.format(DATE_FORMAT) : null
        });
    }

    protected static convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.date = res.body.date != null ? moment(res.body.date) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((point: IPoint) => {
                point.date = point.date != null ? moment(point.date) : null;
            });
        }
        return res;
    }

    constructor(protected http: HttpClient) {}

    create(point: IPoint): Observable<EntityResponseType> {
        const copy = PointService.convertDateFromClient(point);
        return this.http
            .post<IPoint>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => PointService.convertDateFromServer(res)));
    }

    update(point: IPoint): Observable<EntityResponseType> {
        const copy = PointService.convertDateFromClient(point);
        return this.http
            .put<IPoint>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => PointService.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IPoint>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => PointService.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IPoint[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IPoint[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    thisWeek(): Observable<EntityResponseType> {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return this.http
            .get(`${SERVER_API_URL}/api/points-this-week?tz=${tz}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => PointService.convertDateFromServer(res)));
    }

    byWeek(date: string): Observable<EntityResponseType> {
        return this.http
            .get(`${SERVER_API_URL}/api/points-by-week/${date}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => PointService.convertDateFromServer(res)));
    }

    byMonth(month: string): Observable<EntityResponseType> {
        return this.http
            .get(`${SERVER_API_URL}/api/points-by-month/${month}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => PointService.convertDateFromServer(res)));
    }
}
