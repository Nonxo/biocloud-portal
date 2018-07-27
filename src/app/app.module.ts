import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClient} from '@angular/common/http';


import {AppComponent} from './app.component';
import {ApiInterceptor} from './auth/api.interceptor';
import {AuthComponent} from './pages/auth/auth.component';
import {RegisterComponent} from './components/auth/register/register.component';
import {LoginComponent} from './components/auth/login/login.component';
import {SharedModule} from './shared/shared.module';
import {DataService} from './service/data.service';
import {AuthService} from './components/auth/auth.service';
import {StorageService} from './service/storage.service';
import {NotifyService} from './service/notify.service';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RecaptchaModule} from "ng-recaptcha";
import {AgmCoreModule} from "@agm/core";
import {DateUtil} from "./util/DateUtil";
import {AuthGuard} from "./auth/guards/auth-guard.service";
import {SessionGuard} from "./auth/guards/session-guard.service";
import {ChangePasswordComponent} from "./pages/change-password/change-password.component";
import {PictureUtil} from "./util/PictureUtil";
import {AddAdminAuthComponent} from "./components/auth/add-admin-auth/add-admin-auth.component";
import {SignUpAsComponent} from "./pages/app-content/sign-up-as/sign-up-as.component";
import {AppContentService} from "./pages/app-content/services/app-content.service";
import {InviteUserComponent} from "./components/auth/invite-user/invite-user.component";
import {ReceiptComponent} from "./pages/app-content/subscription-history/receipt/receipt.component";
import {Angulartics2Facebook, Angulartics2Module} from "angulartics2";

@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        RegisterComponent,
        AddAdminAuthComponent,
        SignUpAsComponent,
        InviteUserComponent,
        LoginComponent,
        ReceiptComponent
    ],
    imports: [
        HttpClientModule,
        SharedModule,
        BrowserModule,
        BrowserAnimationsModule,
        RecaptchaModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyC7hZTZ41Qwx4XT70L8FaGico6H6w8buaU',
            libraries: ['places']
        }),
        Angulartics2Module.forRoot([Angulartics2Facebook]),
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
        PictureUtil,
        AppContentService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiInterceptor,
            multi: true
        }
    ],
    entryComponents: [ChangePasswordComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
