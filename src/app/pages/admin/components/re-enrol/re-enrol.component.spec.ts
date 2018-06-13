import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReEnrolComponent } from './re-enrol.component';

describe('ReEnrolComponent', () => {
  let component: ReEnrolComponent;
  let fixture: ComponentFixture<ReEnrolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReEnrolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReEnrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
