import {NgModule} from '@angular/core';
import {AdminComponent} from './admin.component';
import {SharedModule} from "../../shared/shared.module";
import {AdminRoutingModule} from "./admin-routing.module";
import {CommonModule} from "@angular/common";
import { NavbarComponent } from './components/navbar/navbar.component';
import {MessageService} from "../../service/message.service";
import { ReEnrolComponent } from './components/re-enrol/re-enrol.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AdminRoutingModule
    ],
    declarations: [AdminComponent, NavbarComponent, ReEnrolComponent],
    providers: [MessageService]
})
export class AdminModule {
}
