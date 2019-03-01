/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { PreferenceDeleteDialogComponent } from 'app/entities/preference/preference-delete-dialog.component';
import { PreferenceService } from 'app/entities/preference/preference.service';

describe('Component Tests', () => {
    describe('Preference Management Delete Component', () => {
        let comp: PreferenceDeleteDialogComponent;
        let fixture: ComponentFixture<PreferenceDeleteDialogComponent>;
        let service: PreferenceService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [PreferenceDeleteDialogComponent]
            })
                .overrideTemplate(PreferenceDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PreferenceDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PreferenceService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
