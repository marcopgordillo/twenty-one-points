import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TwentyOnePointsSharedModule } from 'app/shared';
import { HISTORY_ROUTE, HOME_ROUTE, HomeComponent } from './';

import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';
import { HistoryComponent } from 'app/history/history.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [
        TwentyOnePointsSharedModule,
        NvD3Module,
        BrowserAnimationsModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        RouterModule.forChild([HOME_ROUTE, HISTORY_ROUTE])
    ],
    declarations: [HomeComponent, HistoryComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TwentyOnePointsHomeModule {}
