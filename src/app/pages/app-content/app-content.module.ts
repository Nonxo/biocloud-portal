import { NgModule } from '@angular/core';
import { AppContentComponent } from './app-content.component';
import {AppContentRoutingModule} from "./app-content-routing.module";
import {HomeComponent} from "./home/home.component";
import {SharedModule} from "../../shared/shared.module";
import {CommonModule} from '@angular/common';
import { SubscribeComponent } from './subscribe/subscribe.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AppContentRoutingModule
  ],
  declarations: [
    HomeComponent,
    AppContentComponent,
    SubscribeComponent
  ]
})
export class AppContentModule { }
