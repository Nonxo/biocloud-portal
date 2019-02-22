import {NgModule} from "@angular/core";
import {SharedModule} from "../../../../../shared/shared.module";
import {OnboardingComponent} from "./onboarding.component";
import {OnboardingRoutingModule} from "./onboarding-routing.module";
import {LocationStepOneComponent} from './location-step-one/location-step-one.component';
import {LocationStepTwoComponent} from './location-step-two/location-step-two.component';
import {LocationStepThreeComponent} from './location-step-three/location-step-three.component';
import {LocationStepFourComponent} from './location-step-four/location-step-four.component';

@NgModule({
    declarations: [OnboardingComponent, LocationStepOneComponent, LocationStepTwoComponent, LocationStepThreeComponent, LocationStepFourComponent],
    imports: [SharedModule, OnboardingRoutingModule],
    providers: []
})

export class OnboardingModule {

}
