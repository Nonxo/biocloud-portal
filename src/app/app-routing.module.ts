import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import {ChangePasswordComponent} from "./pages/change-password/change-password.component";
import {SessionGuard} from "./auth/guards/session-guard.service";
import {ProfileComponent} from "./pages/app-content/profile/profile.component";


const routes: Routes = [
  {path: '', redirectTo: '/auth', pathMatch: 'full'},
  {path: 'auth', component: AuthComponent, canActivate: [SessionGuard]},
  {path: 'change-password', component: ChangePasswordComponent},
  {path: 'profile', component: ProfileComponent},

  {path: 'auth', component: AuthComponent},
  {
    path: 'portal',
    loadChildren: 'app/pages/app-content/app-content.module#AppContentModule'
  },
  // {
  //   path: 'report-dashboard',
  //   component: ReportDashboardComponent
  // },
  {path: '**', redirectTo: '/auth'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, useHash: true})],
  exports: []
})
export class AppRoutingModule {
}
