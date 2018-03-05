import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import {SessionGuard} from "./auth/guards/session-guard.service";


const routes: Routes = [
  {path: '', redirectTo: '/auth', pathMatch: 'full'},
  {path: 'auth', component: AuthComponent, canActivate: [SessionGuard]},
  {
    path: 'portal',
    loadChildren: 'app/pages/app-content/app-content.module#AppContentModule'
  },
  {path: '**', redirectTo: '/auth'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, useHash: true})],
  exports: []
})
export class AppRoutingModule {
}
