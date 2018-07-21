import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetabaseReportComponent } from './analytics.component';

describe('MetabaseReportComponent', () => {
  let component: MetabaseReportComponent;
  let fixture: ComponentFixture<MetabaseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetabaseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetabaseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
