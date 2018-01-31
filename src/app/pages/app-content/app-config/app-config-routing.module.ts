/**
 * Created by Kingsley Ezeokeke on 1/31/2018.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppConfigComponent} from "./app-config.component";
import {SetupComponent} from "./setup/setup.component";

const routes: Routes = [
    {
        path:'',
        component: AppConfigComponent,
        children: [
            {
                path:'',
                component: SetupComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: []
})
export class AppConfigRoutingModule { }
