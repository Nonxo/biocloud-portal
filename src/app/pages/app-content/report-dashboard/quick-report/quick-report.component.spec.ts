import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickReportComponent } from './quick-report.component';

describe('QuickReportComponent', () => {
  let component: QuickReportComponent;
  let fixture: ComponentFixture<QuickReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
