import { NgModule } from '@angular/core';
import { AppContentComponent } from './app-content.component';
import {AppContentRoutingModule} from "./app-content-routing.module";
import {HomeComponent} from "./home/home.component";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    AppContentRoutingModule
  ],
  declarations: [
    HomeComponent,
    AppContentComponent
  ]
})
export class AppContentModule { }
