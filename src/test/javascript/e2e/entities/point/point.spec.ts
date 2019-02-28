/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PointComponentsPage, PointDeleteDialog, PointUpdatePage } from './point.page-object';

const expect = chai.expect;

describe('Point e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let pointUpdatePage: PointUpdatePage;
    let pointComponentsPage: PointComponentsPage;
    let pointDeleteDialog: PointDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Points', async () => {
        await navBarPage.goToEntity('point');
        pointComponentsPage = new PointComponentsPage();
        await browser.wait(ec.visibilityOf(pointComponentsPage.title), 5000);
        expect(await pointComponentsPage.getTitle()).to.eq('twentyOnePointsApp.point.home.title');
    });

    it('should load create Point page', async () => {
        await pointComponentsPage.clickOnCreateButton();
        pointUpdatePage = new PointUpdatePage();
        expect(await pointUpdatePage.getPageTitle()).to.eq('twentyOnePointsApp.point.home.createOrEditLabel');
        await pointUpdatePage.cancel();
    });

    it('should create and save Points', async () => {
        const nbButtonsBeforeCreate = await pointComponentsPage.countDeleteButtons();

        await pointComponentsPage.clickOnCreateButton();
        await promise.all([
            pointUpdatePage.setDateInput('2000-12-31'),
            pointUpdatePage.setExerciseInput('5'),
            pointUpdatePage.setMealsInput('5'),
            pointUpdatePage.setAlcoholInput('5'),
            pointUpdatePage.setNotesInput('notes'),
            pointUpdatePage.loginSelectLastOption()
        ]);
        expect(await pointUpdatePage.getDateInput()).to.eq('2000-12-31');
        expect(await pointUpdatePage.getExerciseInput()).to.eq('5');
        expect(await pointUpdatePage.getMealsInput()).to.eq('5');
        expect(await pointUpdatePage.getAlcoholInput()).to.eq('5');
        expect(await pointUpdatePage.getNotesInput()).to.eq('notes');
        await pointUpdatePage.save();
        expect(await pointUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await pointComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Point', async () => {
        const nbButtonsBeforeDelete = await pointComponentsPage.countDeleteButtons();
        await pointComponentsPage.clickOnLastDeleteButton();

        pointDeleteDialog = new PointDeleteDialog();
        expect(await pointDeleteDialog.getDialogTitle()).to.eq('twentyOnePointsApp.point.delete.question');
        await pointDeleteDialog.clickOnConfirmButton();

        expect(await pointComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
