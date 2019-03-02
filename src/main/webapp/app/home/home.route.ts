import { Route } from '@angular/router';

import { HomeComponent } from './';
import { HistoryComponent } from 'app/history/history.component';
import { AboutComponent } from 'app/about/about.component';

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

export const ABOUT_ROUTE: Route = {
    path: 'about',
    component: AboutComponent,
    data: {
        authorities: [],
        pageTitle: 'global.menu.about'
    }
};
