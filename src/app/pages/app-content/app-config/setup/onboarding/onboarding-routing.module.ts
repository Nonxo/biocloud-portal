import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {OnboardingComponent} from "./onboarding.component";
import {LocationStepOneComponent} from "./location-step-one/location-step-one.component";
import {LocationStepTwoComponent} from "./location-step-two/location-step-two.component";
import {LocationStepThreeComponent} from "./location-step-three/location-step-three.component";
import {LocationStepFourComponent} from "./location-step-four/location-step-four.component";
import {CompanySetupComponent} from "./company-setup/company-setup.component";

const routes: Routes = [
    {
        path:'',
        component: OnboardingComponent,
        children: [
            {
                path:'',
                component: CompanySetupComponent
            },
            {
                path:'step-one',
                component: LocationStepOneComponent
            },
            {
                path:'step-two',
                component: LocationStepTwoComponent
            },
            {
                path:'step-three',
                component: LocationStepThreeComponent
            },
            {
                path:'step-four',
                component: LocationStepFourComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: []
})
export class OnboardingRoutingModule { }
