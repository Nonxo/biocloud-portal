import {WizardStepperComponent} from './components/wizard-stepper/wizard-stepper.component';
import {RegEmailNotificationComponent} from './components/auth/register/reg-email-notification/reg-email-notification.component';
import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {ChangePasswordComponent} from "./pages/change-password/change-password.component";
import {SessionGuard} from "./auth/guards/session-guard.service";
import {AddAdminAuthComponent} from "./components/auth/add-admin-auth/add-admin-auth.component";
import {SignUpAsComponent} from "./pages/app-content/sign-up-as/sign-up-as.component";
import {InviteUserComponent} from "./components/auth/invite-user/invite-user.component";
import {ReceiptComponent} from "./pages/app-content/subscription-history/receipt/receipt.component";
import {FlowTwoComponent} from "./pages/auth/flow-two/flow-two.component";
import {LandingPageComponent} from './landing-page/landing-page.component';
import {ApproveCoordinatesComponent} from "./components/auth/approve-coordinates/approve-coordinates.component";
import {RegisterComponent} from "./components/auth/register/register.component";


const routes: Routes = [
    {path: '', redirectTo: '/auth', pathMatch: 'full'},
    {path: 'get-started', component: LandingPageComponent, canActivate: [SessionGuard]},
    {path: 'auth', component: FlowTwoComponent, canActivate: [SessionGuard]},
    {path: 'invite', component: AddAdminAuthComponent},
    {path: 'inviteuser', component: InviteUserComponent},
    {path: 'approve-coord', component: ApproveCoordinatesComponent},
    {path: 'change-password', component: ChangePasswordComponent},
    {path: 'sign-up-as', component: SignUpAsComponent},
    {path: 'receipt', component: ReceiptComponent},
    {path: 'reg-message', component: RegEmailNotificationComponent},
    {path: 'wizard', component: WizardStepperComponent},
    {path: 'auth/register', component: RegisterComponent},
    {
        path: 'portal',
        loadChildren: 'app/pages/app-content/app-content.module#AppContentModule'
    },
    {
        path: 'onboard',
        loadChildren: 'app/pages/app-content/app-config/setup/onboarding/onboarding.module#OnboardingModule'
    },
    {
        path: 'admin',
        loadChildren: 'app/pages/admin/admin.module#AdminModule'
    },
    {path: '**', redirectTo: '/auth'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, useHash: true})],
  exports: []
})
export class AppRoutingModule {
}
