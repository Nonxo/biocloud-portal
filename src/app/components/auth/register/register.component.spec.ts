import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import {AppConfigService} from "../../../pages/app-content/app-config/services/app-config.service";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {StorageService} from "../../../service/storage.service";
import {AuthService} from "../auth.service";
import {DataService} from "../../../service/data.service";
import {RouterTestingModule} from "@angular/router/testing";
import {NotifyService} from "../../../service/notify.service";
import {SharedModule} from "../../../shared/shared.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppContentService} from "../../../pages/app-content/services/app-content.service";
import {Endpoints} from "../../../util/endpoints";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let service: AppConfigService;
    let httpTestingController: HttpTestingController;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RegisterComponent],
            imports: [SharedModule, HttpClientTestingModule, RouterTestingModule, BrowserAnimationsModule],
            providers: [AuthService, StorageService, DataService, NotifyService, AppContentService, AppConfigService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();

        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(AppConfigService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        service = TestBed.get(AppConfigService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('call email verification service', () => {
        let email = "ezekiel_zakari@yahoo.com";
        const mock = {
            code: 0,
            description: ""
        };

        service.verifyEmail(email)
            .subscribe(result => {
                expect(result.code).toEqual(0);
            });

        const req = httpTestingController.expectOne(Endpoints.VERIFY_IF_EMAIL_EXIST + email);

        expect(req.request.method).toEqual('GET');

        req.flush(mock);
    });


});
