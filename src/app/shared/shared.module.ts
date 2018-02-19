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
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import {NavComponent} from '../components/nav/nav.component';
import {RouterModule} from '@angular/router';
import {
    ModalModule ,
    PopoverModule,
    CarouselModule
} from 'ngx-bootstrap';
import { AlertModule } from 'ngx-alerts';
import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {ClickOutsideModule} from "ng-click-outside/lib/index";
import {EllipsisPipe} from "../util/pipes/ellipsis-pipe";
import {SetupComponent} from "../pages/app-content/app-config/setup/setup.component";
import {OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime/picker";
import {AgmCoreModule} from "@agm/core";

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
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        CarouselModule.forRoot(),
        AlertModule.forRoot({maxMessages: 5, timeout: 5000}),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        ClickOutsideModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDX0uywgARFKu6Tsr6qC4v6acFdtrCxfAI',
            libraries: ['places']
        })
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
        AgmCoreModule

    ],
    declarations: [NavComponent, SetupComponent, EllipsisPipe]
})
export class SharedModule {
}
