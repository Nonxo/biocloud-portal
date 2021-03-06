import {NgModule} from '@angular/core';
import {AppContentComponent} from './app-content.component';
import {AppContentRoutingModule} from "./app-content-routing.module";
import {HomeComponent} from "./home/home.component";
import {SharedModule} from "../../shared/shared.module";
import {CommonModule} from '@angular/common';
import {SubscribeComponent} from './subscribe/subscribe.component';
import {SubscriptionHistoryComponent} from './subscription-history/subscription-history.component';
import {SetupComponent} from "./app-config/setup/setup.component";
import {AppConfigService} from "./app-config/services/app-config.service";
import {GeoMapService} from "../../service/geo-map.service";
import {AddAttendeesComponent} from "./app-config/add-attendees/add-attendees.component";
import {ManageAttendeesComponent} from './manage-attendees/manage-attendees.component';
import {ReportDashboardComponent} from './report-dashboard/report-dashboard.component';
import {CustomReportComponent} from './custom-report/custom-report.component';
import {LatenessReportComponent} from './lateness-report/lateness-report.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {SearchService} from "../../service/search.service";
import {ProfileComponent} from "./profile/profile.component";
import {ManageAdminsComponent} from './manage-admins/manage-admins.component';
import {SettingComponent} from './setting/setting.component';
import {ReportService} from "./services/report.service";
import {BsModalRef, PaginationModule} from "ngx-bootstrap";
import {EmployeeOverviewComponent} from './employee-overview/employee-overview.component';
import {GaugeModule} from "angular-gauge";
import {SubscriptionService} from "./services/subscription.service";
import {SubscriptionCardDetailsComponent} from './subscribe/subscription-card-details/subscription-card-details.component';
import {EmployeesReportComponent} from './report-dashboard/employees-report/employees-report.component';
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {QuickReportComponent} from './report-dashboard/quick-report/quick-report.component';
import {MetabaseReportComponent} from './report-dashboard/analytics/analytics.component';
import {ConfirmLocationComponent} from './confirm-location/confirm-location.component';
import {ManageScheduleComponent} from './manage-schedule/manage-schedule.component';
import {DataTableModule} from "@cmglez10/ng-datatable";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DataTableModule,
        PaginationModule.forRoot(),
        GaugeModule.forRoot(),
        InfiniteScrollModule,
        AppContentRoutingModule
    ],
    declarations: [
        HomeComponent,
        AppContentComponent,
        SubscribeComponent,
        SubscriptionHistoryComponent,
        ManageAttendeesComponent,
        ReportDashboardComponent,
        CustomReportComponent,
        LatenessReportComponent,
        NotificationsComponent,
        ProfileComponent,
        ManageAdminsComponent,
        SettingComponent,
        EmployeeOverviewComponent,
        SubscriptionCardDetailsComponent,
        EmployeesReportComponent,
        QuickReportComponent,
        MetabaseReportComponent,
        ConfirmLocationComponent,
        ManageScheduleComponent
    ],
    providers: [AppConfigService, GeoMapService, SearchService, ReportService, SubscriptionService, BsModalRef],
    entryComponents: [SetupComponent, AddAttendeesComponent, ConfirmLocationComponent]
})
export class AppContentModule { }
