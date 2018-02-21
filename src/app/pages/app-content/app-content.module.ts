import {NgModule} from '@angular/core';
import {AppContentComponent} from './app-content.component';
import {AppContentRoutingModule} from "./app-content-routing.module";
import {HomeComponent} from "./home/home.component";
import {SharedModule} from "../../shared/shared.module";
import {CommonModule} from '@angular/common';
import {SubscribeComponent} from './subscribe/subscribe.component';
import {SubscriptionHistoryComponent} from './subscription-history/subscription-history.component';
import {SideNavComponent} from "../../components/side-nav/side-nav.component";
import {AppContentService} from "./services/app-content.service";
import {MessageService} from "../../service/message.service";
import {SetupComponent} from "./app-config/setup/setup.component";
import {AppConfigService} from "./app-config/services/app-config.service";
import {GeoMapService} from "../../service/geo-map.service";
import {AddAttendeesComponent} from "./app-config/add-attendees/add-attendees.component";
import {DataTableModule} from "angular2-datatable";
import { ManageAttendeesComponent } from './manage-attendees/manage-attendees.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DataTableModule,
        AppContentRoutingModule
    ],
    declarations: [
        HomeComponent,
        AppContentComponent,
        SubscribeComponent,
        SubscriptionHistoryComponent,
        SideNavComponent,
        ManageAttendeesComponent
    ],
    providers: [AppContentService, MessageService, AppConfigService, GeoMapService],
    entryComponents: [SetupComponent, AddAttendeesComponent]
})
export class AppContentModule {
}
