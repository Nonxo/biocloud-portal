import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {OnboardingComponent} from "./onboarding.component";
import {LocationStepOneComponent} from "./location-step-one/location-step-one.component";

const routes: Routes = [
    {
        path:'',
        component: OnboardingComponent,
        children: [
            {
                path:'',
                component: LocationStepOneComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: []
})
export class OnboardingRoutingModule { }
