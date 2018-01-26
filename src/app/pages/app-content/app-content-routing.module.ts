/**
 * Created by Kingsley Ezeokeke on 1/26/2018.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppContentComponent} from "./app-content.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
    {
        path:'', 
        component:AppContentComponent,
        children: [
            {
                path:'',
                component: HomeComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: []
})
export class AppContentRoutingModule { }
