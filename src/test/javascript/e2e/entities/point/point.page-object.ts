import { element, by, ElementFinder } from 'protractor';

export class PointComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-point div table .btn-danger'));
    title = element.all(by.css('jhi-point div h2#page-heading span')).first();

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

export class PointUpdatePage {
    pageTitle = element(by.id('jhi-point-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    dateInput = element(by.id('field_date'));
    exerciseInput = element(by.id('field_exercise'));
    mealsInput = element(by.id('field_meals'));
    alcoholInput = element(by.id('field_alcohol'));
    notesInput = element(by.id('field_notes'));
    loginSelect = element(by.id('field_login'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setDateInput(date) {
        await this.dateInput.sendKeys(date);
    }

    async getDateInput() {
        return this.dateInput.getAttribute('value');
    }

    async setExerciseInput(exercise) {
        await this.exerciseInput.sendKeys(exercise);
    }

    async getExerciseInput() {
        return this.exerciseInput.getAttribute('value');
    }

    async setMealsInput(meals) {
        await this.mealsInput.sendKeys(meals);
    }

    async getMealsInput() {
        return this.mealsInput.getAttribute('value');
    }

    async setAlcoholInput(alcohol) {
        await this.alcoholInput.sendKeys(alcohol);
    }

    async getAlcoholInput() {
        return this.alcoholInput.getAttribute('value');
    }

    async setNotesInput(notes) {
        await this.notesInput.sendKeys(notes);
    }

    async getNotesInput() {
        return this.notesInput.getAttribute('value');
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

export class PointDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-point-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-point'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
