import { NgModule } from '@angular/core';
import { AppContentComponent } from './app-content.component';
import {AppContentRoutingModule} from "./app-content-routing.module";
import {HomeComponent} from "./home/home.component";
import {SharedModule} from "../../shared/shared.module";
import { SetupComponent } from './setup/setup.component';
import { WizardStepperComponent } from '../../components/wizard-stepper/wizard-stepper.component';

@NgModule({
  imports: [
    SharedModule,
    AppContentRoutingModule
  ],
  declarations: [
    HomeComponent,
    AppContentComponent,
    SetupComponent,
    WizardStepperComponent
  ]
})
export class AppContentModule { }
