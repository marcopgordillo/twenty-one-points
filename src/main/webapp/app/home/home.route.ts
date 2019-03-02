import { Route } from '@angular/router';

import { HomeComponent } from './';
import { HistoryComponent } from 'app/history/history.component';

export const HOME_ROUTE: Route = {
    path: '',
    component: HomeComponent,
    data: {
        authorities: [],
        pageTitle: 'home.title'
    }
};

export const HISTORY_ROUTE: Route = {
    path: 'history',
    component: HistoryComponent,
    data: {
        authorities: [],
        pageTitle: 'global.menu.history'
    }
};
