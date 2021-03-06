import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import {NavComponent} from '../components/nav/nav.component';
import {RouterModule} from '@angular/router';
import {CarouselModule, ModalModule, PopoverModule} from 'ngx-bootstrap';
import {AlertModule} from 'ngx-alerts';
import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {ClickOutsideModule} from "ng-click-outside/lib/index";
import {EllipsisPipe} from "../util/pipes/ellipsis-pipe";
import {SetupComponent} from "../pages/app-content/app-config/setup/setup.component";
import {AgmCoreModule} from "@agm/core";
import {AddAttendeesComponent} from "../pages/app-content/app-config/add-attendees/add-attendees.component";
import {HasAuthorityDirective} from "../directives/has-authority.directive";
import {LoadingComponent} from '../components/loading/loading.component';
import {ChangePasswordComponent} from "../pages/change-password/change-password.component";
import {OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import {ImageCropperModule} from "ngx-image-cropper";
import {CreateLocationComponent} from "../pages/app-content/app-config/setup/onboarding/create-location/create-location.component";
import {WizardStepperComponent} from "../components/wizard-stepper/wizard-stepper.component";
import {SignUpAsComponent} from "../pages/app-content/sign-up-as/sign-up-as.component";
import {JoyrideModule} from "ngx-joyride";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
    imports: [
        CommonModule,
        CdkTableModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        FormsModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        RouterModule,
        JoyrideModule.forRoot(),
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        CarouselModule.forRoot(),
        AlertModule.forRoot({maxMessages: 1, timeout: 10000}),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        ClickOutsideModule,
        AgmCoreModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        ImageCropperModule
    ],
    exports: [
        CdkTableModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        FormsModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        NavComponent,
        RouterModule,
        ModalModule,
        PopoverModule,
        CarouselModule,
        AlertModule,
        TranslateModule,
        ClickOutsideModule,
        EllipsisPipe,
        SetupComponent,
        AgmCoreModule,
        AddAttendeesComponent,
        HasAuthorityDirective,
        LoadingComponent,
        ChangePasswordComponent,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        ImageCropperModule,
        CreateLocationComponent,
        WizardStepperComponent,
        SignUpAsComponent,
        JoyrideModule

    ],
    declarations: [NavComponent, SetupComponent, EllipsisPipe, AddAttendeesComponent, HasAuthorityDirective, LoadingComponent, ChangePasswordComponent, CreateLocationComponent, WizardStepperComponent, SignUpAsComponent]
})
export class SharedModule {
}
