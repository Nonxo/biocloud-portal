/**
 * Created by Kingsley Ezeokeke on 1/26/2018.
 */

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppContentComponent} from './app-content.component';
import {HomeComponent} from './home/home.component';
import {SubscribeComponent} from './subscribe/subscribe.component';
import {SubscriptionHistoryComponent} from './subscription-history/subscription-history.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {ManageAttendeesComponent} from "./manage-attendees/manage-attendees.component";
import {ReportDashboardComponent} from './report-dashboard/report-dashboard.component';
import {CustomReportComponent} from './custom-report/custom-report.component';
import {LatenessReportComponent} from './lateness-report/lateness-report.component';
import {AuthGuard} from "../../auth/guards/auth-guard.service";
import {ProfileComponent} from "./profile/profile.component";
import {ManageAdminsComponent} from "./manage-admins/manage-admins.component";
import {SettingComponent} from './setting/setting.component';
import {EmployeeOverviewComponent} from "./employee-overview/employee-overview.component";
import {SubscriptionCardDetailsComponent} from './subscribe/subscription-card-details/subscription-card-details.component';
import {EmployeesReportComponent} from "./report-dashboard/employees-report/employees-report.component";
import {QuickReportComponent} from "./report-dashboard/quick-report/quick-report.component";
import {MetabaseReportComponent} from "./report-dashboard/metabase-report/metabase-report.component";

const routes: Routes = [
    {
        path: '',
        component: AppContentComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
                canActivate: [AuthGuard]
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
                path: 'manage-admins',
                component: ManageAdminsComponent
            },
            {
                path: 'report-dashboard',
                component: ReportDashboardComponent
            },
            {
                path: 'report-dashboard/employee',
                component: EmployeesReportComponent
            },
            {
                path: 'quick-report',
                component: QuickReportComponent
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
                path: 'analytics',
                component: MetabaseReportComponent
            },
            {
                path: 'subscription-history',
                component: SubscriptionHistoryComponent
            },
            {
                path: 'notification',
                component: NotificationsComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'setting',
                component: SettingComponent
            },
            {
                path: 'overview',
                component: EmployeeOverviewComponent
            },

            {
                path: 'card-details',
                component: SubscriptionCardDetailsComponent
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
