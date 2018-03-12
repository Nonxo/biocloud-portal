import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClient} from '@angular/common/http';


import { AppComponent } from './app.component';
import { ApiInterceptor } from './auth/api.interceptor';
import { AuthComponent } from './pages/auth/auth.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SharedModule } from './shared/shared.module';
import { DataService } from './service/data.service';
import { AuthService } from './components/auth/auth.service';
import { StorageService } from './service/storage.service';
import { NotifyService } from './service/notify.service';
import { AppRoutingModule } from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RecaptchaModule} from "ng-recaptcha";
import {AgmCoreModule} from "@agm/core";
import {DateUtil} from "./util/DateUtil";
import {AuthGuard} from "./auth/guards/auth-guard.service";
import {SessionGuard} from "./auth/guards/session-guard.service";
import {ChangePasswordComponent} from "./pages/change-password/change-password.component";
import {AddAdminAuthComponent} from "./components/auth/add-admin-auth/add-admin-auth.component";


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    RegisterComponent,
    ChangePasswordComponent,
    AddAdminAuthComponent,
    LoginComponent
  ],
  imports: [
    HttpClientModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    RecaptchaModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDX0uywgARFKu6Tsr6qC4v6acFdtrCxfAI',
      libraries: ['places']
    }),
    AppRoutingModule
  ],
  providers: [
    AuthService,
    DataService,
    AuthGuard,
    SessionGuard,
    StorageService,
    NotifyService,
    DateUtil,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ],
  entryComponents: [ChangePasswordComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
