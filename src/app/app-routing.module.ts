import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {ChangePasswordComponent} from "./pages/change-password/change-password.component";
import {SessionGuard} from "./auth/guards/session-guard.service";
import {AddAdminAuthComponent} from "./components/auth/add-admin-auth/add-admin-auth.component";
import {SignUpAsComponent} from "./pages/app-content/sign-up-as/sign-up-as.component";
import {InviteUserComponent} from "./components/auth/invite-user/invite-user.component";
import {ReceiptComponent} from "./pages/app-content/subscription-history/receipt/receipt.component";
import {FlowTwoComponent} from "./pages/auth/flow-two/flow-two.component";
import { LandingPageComponent } from './landing-page/landing-page.component';


const routes: Routes = [
    {path: '', redirectTo: '/auth', pathMatch: 'full'},
    {path: 'get-started', component: LandingPageComponent},
    {path: 'auth', component: FlowTwoComponent, canActivate: [SessionGuard]},
    {path: 'invite', component: AddAdminAuthComponent},
    {path: 'inviteuser', component: InviteUserComponent},
    {path: 'change-password', component: ChangePasswordComponent},
    {path: 'sign-up-as', component: SignUpAsComponent},
    {path: 'receipt', component: ReceiptComponent},
    {
        path: 'portal',
        loadChildren: 'app/pages/app-content/app-content.module#AppContentModule'
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
