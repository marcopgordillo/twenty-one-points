/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { PreferenceComponent } from 'app/entities/preference/preference.component';
import { PreferenceService } from 'app/entities/preference/preference.service';
import { Preference } from 'app/shared/model/preference.model';

describe('Component Tests', () => {
    describe('Preference Management Component', () => {
        let comp: PreferenceComponent;
        let fixture: ComponentFixture<PreferenceComponent>;
        let service: PreferenceService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [PreferenceComponent],
                providers: []
            })
                .overrideTemplate(PreferenceComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PreferenceComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PreferenceService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Preference(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.preferences[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
