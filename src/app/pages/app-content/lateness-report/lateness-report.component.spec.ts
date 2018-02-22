import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatenessReportComponent } from './lateness-report.component';

describe('LatenessReportComponent', () => {
  let component: LatenessReportComponent;
  let fixture: ComponentFixture<LatenessReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatenessReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatenessReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
