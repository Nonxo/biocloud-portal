import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClient} from '@angular/common/http';


import { AppComponent } from './app.component';
import { ApiInterceptor } from './auth/api.interceptor';
import { AuthComponent } from './pages/auth/auth.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SharedModule } from './shared/shared.module';
import { AuthGuardService } from './service/auth-guard.service';
import { DataService } from './service/data.service';
import { AuthService } from './components/auth/auth.service';
import { StorageService } from './service/storage.service';
import { NotifyService } from './service/notify.service';
import { AppRoutingModule } from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RecaptchaModule} from "ng-recaptcha";
import {AgmCoreModule} from "@agm/core";
import { NotificationsComponent } from './notifications/notifications.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    RegisterComponent,
    LoginComponent,
    NotificationsComponent,
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
    StorageService,
    NotifyService,
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
