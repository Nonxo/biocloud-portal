import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDashboardComponent } from './report-dashboard.component';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {SharedModule} from "../../../shared/shared.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {DataTableModule} from "@cmglez10/ng-datatable";
import {PaginationModule} from "ngx-bootstrap";
import {ReportService} from "../services/report.service";
import {AuthService} from "../../../components/auth/auth.service";
import {StorageService} from "../../../service/storage.service";
import {DataService} from "../../../service/data.service";
import {AppContentService} from "../services/app-content.service";
import {PictureUtil} from "../../../util/PictureUtil";
import {NotifyService} from "../../../service/notify.service";
import {MessageService} from "../../../service/message.service";
import {DateUtil} from "../../../util/DateUtil";

fdescribe('ReportDashboardComponent', () => {
  let component: ReportDashboardComponent;
  let fixture: ComponentFixture<ReportDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports : [
            RouterTestingModule,
            HttpClientTestingModule,
            SharedModule,
            BrowserAnimationsModule,
            FormsModule,
            ReactiveFormsModule,
            BrowserModule,
            DataTableModule,
            PaginationModule
        ],
      declarations: [ ReportDashboardComponent ],
        providers: [
            ReportService,
            AuthService,
            StorageService,
            DataService,
            AppContentService,
            PictureUtil,
            NotifyService,
            MessageService,
            DateUtil
        ],
        schemas: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('should contain tooltip', () => {
        expect(
            document.querySelector('#early').textContent
        ).toContain('Early');

        expect(
            document.querySelector('#late').textContent
        ).toContain('Late');

        expect(
            document.querySelector('#absent').textContent
        ).toContain('Absent');

        expect(
            document.querySelector('#wrongLocation').textContent
        ).toContain('Wrong location');
    });
});



