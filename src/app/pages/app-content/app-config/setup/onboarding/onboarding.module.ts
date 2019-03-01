import {NgModule} from "@angular/core";
import {SharedModule} from "../../../../../shared/shared.module";
import {OnboardingComponent} from "./onboarding.component";
import {OnboardingRoutingModule} from "./onboarding-routing.module";
import {LocationStepOneComponent} from './location-step-one/location-step-one.component';
import {LocationStepTwoComponent} from './location-step-two/location-step-two.component';
import {LocationStepThreeComponent} from './location-step-three/location-step-three.component';
import {LocationStepFourComponent} from './location-step-four/location-step-four.component';
import {CompanySetupComponent} from './company-setup/company-setup.component';
import {SharedService} from "./service/sharedService";

@NgModule({
    declarations: [OnboardingComponent, LocationStepOneComponent, LocationStepTwoComponent, LocationStepThreeComponent, LocationStepFourComponent, CompanySetupComponent],
    imports: [SharedModule, OnboardingRoutingModule],
    providers: [SharedService]
})

export class OnboardingModule {

}
