import {NgModule} from '@angular/core';
import {AppConfigComponent} from './app-config.component';
import {SharedModule} from "../../../shared/shared.module";
import {WizardStepperComponent} from "../../../components/wizard-stepper/wizard-stepper.component";
import {SetupComponent} from "./setup/setup.component";
import {AppConfigRoutingModule} from "./app-config-routing.module";
import {CommonModule} from '@angular/common';
import { AddAttendeesComponent } from './add-attendees/add-attendees.component';
import { GroupAttendeesComponent } from './group-attendees/group-attendees.component';
import {AppConfigService} from "./services/app-config.service";
import {OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime/picker";
import {AgmCoreModule} from "@agm/core";
import {GeoMapService} from "../../../service/geo-map.service";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        AppConfigRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDX0uywgARFKu6Tsr6qC4v6acFdtrCxfAI',
            libraries: ['places']
        })
    ],
    declarations: [
        AppConfigComponent,
        WizardStepperComponent,
        SetupComponent,
        AddAttendeesComponent,
        GroupAttendeesComponent
    ],
    providers: [AppConfigService, GeoMapService]
})
export class AppConfigModule {
}
