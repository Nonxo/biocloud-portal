import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavComponent } from './nav.component';
import {SharedModule} from "../../shared/shared.module";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BrowserDynamicTestingModule} from "@angular/platform-browser-dynamic/testing";
import {AuthService} from "../auth/auth.service";
import {StorageService} from "../../service/storage.service";
import {DataService} from "../../service/data.service";
import {AppContentService} from "../../pages/app-content/services/app-content.service";
import {NotifyService} from "../../service/notify.service";
import {MessageService} from "../../service/message.service";
import {PictureUtil} from "../../util/PictureUtil";
import {SearchService} from "../../service/search.service";
import {SubscriptionService} from "../../pages/app-content/services/subscription.service";
import {DateUtil} from "../../util/DateUtil";
import {CookieService} from "../../service/cookie.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSidenavModule} from "@angular/material/sidenav";
import {Org} from "../../pages/app-content/model/app-content.model";

fdescribe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let compiledElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
            SharedModule,
            RouterTestingModule,
            HttpClientTestingModule,
            BrowserDynamicTestingModule,
            BrowserAnimationsModule,
            MatSidenavModule,
        ],
      declarations: [
      ],
        providers: [
            AuthService,
            StorageService,
            DataService,
            AppContentService,
            NotifyService,
            MessageService,
            PictureUtil,
            SearchService,
            SubscriptionService,
            DateUtil,
            CookieService
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    let newOrg = new Org();
    newOrg.name = 'seamfix';
    newOrg.orgId = '123456';
    newOrg.orgCode = 'sfx154';
    newOrg.active = true;
    newOrg.orgType = 'flows';
    component.orgs.push(newOrg);
    component.openDropdown = true;

    console.log(component.orgs.length);

    compiledElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should check if the company logos have same size', () => {
      const el = compiledElement.querySelector('#companyLogoContainer');
      const imgEl = compiledElement.querySelector('#companyLogoContainer > img');
      expect(el.className).toContain('companyLogoDiv');
      expect(imgEl.className).toContain('companyLogo');
  });

  it( 'Should check if the company list in the dropdown have same size', () => {
      const el = compiledElement.querySelector('#companyItemLogoContainer');
      const imgEl = compiledElement.querySelector('#companyItemLogoContainer > img');
      expect(el.className).toContain('companyItemLogoDiv');
      expect(imgEl.className).toContain( 'companyLogo')
  })
});
