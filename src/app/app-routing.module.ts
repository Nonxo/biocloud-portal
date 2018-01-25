import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {path:'', redirectTo:'/auth', pathMatch:'full'},
  {path:'auth', component:AuthComponent},
  {path:'portal', children:[
    {path:'', component:HomeComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
