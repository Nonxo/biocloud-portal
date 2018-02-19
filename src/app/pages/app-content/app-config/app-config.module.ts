import {NgModule} from '@angular/core';
import {AppConfigComponent} from './app-config.component';
import {SharedModule} from "../../../shared/shared.module";
import {WizardStepperComponent} from "../../../components/wizard-stepper/wizard-stepper.component";
import {AppConfigRoutingModule} from "./app-config-routing.module";
import {CommonModule} from '@angular/common';
import {AddAttendeesComponent} from './add-attendees/add-attendees.component';
import {GroupAttendeesComponent} from './group-attendees/group-attendees.component';
import {BsModalRef} from "ngx-bootstrap/index";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AppConfigRoutingModule
    ],
    declarations: [
        AppConfigComponent,
        WizardStepperComponent,
        AddAttendeesComponent,
        GroupAttendeesComponent
    ],
    providers: [BsModalRef]
})
export class AppConfigModule {
}
