import { NgModule } from '@angular/core';
import { AppContentComponent } from './app-content.component';
import {AppContentRoutingModule} from "./app-content-routing.module";
import {HomeComponent} from "./home/home.component";
import {SharedModule} from "../../shared/shared.module";
import {CommonModule} from '@angular/common';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { SubscriptionHistoryComponent } from './subscription-history/subscription-history.component';
import {SideNavComponent} from "../../components/side-nav/side-nav.component";
import {AppContentService} from "./services/app-content.service";
import {MessageService} from "../../service/message.service";
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';
import { CustomReportComponent } from './custom-report/custom-report.component';
import { LatenessReportComponent } from './lateness-report/lateness-report.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AppContentRoutingModule
  ],
  declarations: [
    HomeComponent,
    AppContentComponent,
    SubscribeComponent,
    SubscriptionHistoryComponent,
    SideNavComponent,
    ReportDashboardComponent,
    CustomReportComponent,
    LatenessReportComponent
  ],
  providers: [AppContentService, MessageService]
})
export class AppContentModule { }
