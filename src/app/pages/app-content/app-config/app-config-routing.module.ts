/**
 * Created by Kingsley Ezeokeke on 1/31/2018.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppConfigComponent} from "./app-config.component";
import {SetupComponent} from "./setup/setup.component";
import { AddAttendeesComponent } from './add-attendees/add-attendees.component';
import { GroupAttendeesComponent } from './group-attendees/group-attendees.component';

const routes: Routes = [
    {
        path:'',
        component: AppConfigComponent,
        children: [
            {
                path:'',
                component: SetupComponent
            },
            {
                path:'add-attendees',
                component: AddAttendeesComponent
            }
            ,
            {
                path:'group-attendees',
                component: GroupAttendeesComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: []
})
export class AppConfigRoutingModule { }
