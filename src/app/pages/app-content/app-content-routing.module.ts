/**
 * Created by Kingsley Ezeokeke on 1/26/2018.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppContentComponent } from './app-content.component';
import { HomeComponent } from './home/home.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { SubscriptionHistoryComponent } from './subscription-history/subscription-history.component';
import {ManageAttendeesComponent} from "./manage-attendees/manage-attendees.component";
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';
import { CustomReportComponent } from './custom-report/custom-report.component';
import { LatenessReportComponent } from './lateness-report/lateness-report.component';

const routes: Routes = [
  {
    path: '',
    component: AppContentComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'config',
        loadChildren: 'app/pages/app-content/app-config/app-config.module#AppConfigModule'
      },
      {
        path: 'subscribe',
        component: SubscribeComponent
      },
      {
        path: 'manage-users',
        component: ManageAttendeesComponent
      },
      {
        path: 'report-dashboard',
        component: ReportDashboardComponent
      },
      {
        path: 'lateness-report',
        component: LatenessReportComponent
      },
      {
        path: 'custom-report',
        component: CustomReportComponent
      },
      {
        path: 'subscription-history',
        component: SubscriptionHistoryComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: []
})
export class AppContentRoutingModule {
}
