import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {AuthComponent} from "./pages/auth/auth.component";

const routes: Routes = [
  {path:'', redirectTo:'/auth', pathMatch:'full'},
  {path:'auth', component:AuthComponent},
  {
    path: 'portal',
    loadChildren: 'app/pages/app-content/app-content.module#AppContentModule'
  },
  {path:'**', redirectTo: '/auth'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules,useHash:true})],
  exports: []
})
export class AppRoutingModule { }
