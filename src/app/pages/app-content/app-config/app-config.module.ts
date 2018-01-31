import {NgModule} from '@angular/core';
import {AppConfigComponent} from './app-config.component';
import {SharedModule} from "../../../shared/shared.module";
import {WizardStepperComponent} from "../../../components/wizard-stepper/wizard-stepper.component";
import {SetupComponent} from "./setup/setup.component";
import {AppConfigRoutingModule} from "./app-config-routing.module";

@NgModule({
    imports: [
        SharedModule,
        AppConfigRoutingModule
    ],
    declarations: [
        AppConfigComponent,
        WizardStepperComponent,
        SetupComponent
    ]
})
export class AppConfigModule {
}
