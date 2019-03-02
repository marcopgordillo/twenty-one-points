import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core';

@Component({
    selector: 'jhi-about',
    templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
    currentAccount: any;

    constructor(private principal: AccountService) {}

    ngOnInit() {
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
    }
}
