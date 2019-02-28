import { element, by, ElementFinder } from 'protractor';

export class BloodPressureComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-blood-pressure div table .btn-danger'));
    title = element.all(by.css('jhi-blood-pressure div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async clickOnLastDeleteButton() {
        await this.deleteButtons.last().click();
    }

    async countDeleteButtons() {
        return this.deleteButtons.count();
    }

    async getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class BloodPressureUpdatePage {
    pageTitle = element(by.id('jhi-blood-pressure-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    timestampInput = element(by.id('field_timestamp'));
    systolicInput = element(by.id('field_systolic'));
    diastolicInput = element(by.id('field_diastolic'));
    loginSelect = element(by.id('field_login'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setTimestampInput(timestamp) {
        await this.timestampInput.sendKeys(timestamp);
    }

    async getTimestampInput() {
        return this.timestampInput.getAttribute('value');
    }

    async setSystolicInput(systolic) {
        await this.systolicInput.sendKeys(systolic);
    }

    async getSystolicInput() {
        return this.systolicInput.getAttribute('value');
    }

    async setDiastolicInput(diastolic) {
        await this.diastolicInput.sendKeys(diastolic);
    }

    async getDiastolicInput() {
        return this.diastolicInput.getAttribute('value');
    }

    async loginSelectLastOption() {
        await this.loginSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async loginSelectOption(option) {
        await this.loginSelect.sendKeys(option);
    }

    getLoginSelect(): ElementFinder {
        return this.loginSelect;
    }

    async getLoginSelectedOption() {
        return this.loginSelect.element(by.css('option:checked')).getText();
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}

export class BloodPressureDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-bloodPressure-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-bloodPressure'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
