import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPreference } from 'app/shared/model/preference.model';
import { PreferenceService } from './preference.service';

@Component({
    selector: 'jhi-preference-delete-dialog',
    templateUrl: './preference-delete-dialog.component.html'
})
export class PreferenceDeleteDialogComponent {
    preference: IPreference;

    constructor(
        protected preferenceService: PreferenceService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.preferenceService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'preferenceListModification',
                content: 'Deleted an preference'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-preference-delete-popup',
    template: ''
})
export class PreferenceDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ preference }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PreferenceDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.preference = preference;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/preference', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/preference', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
