import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LocationStepOneComponent} from './location-step-one.component';

describe('LocationStepOneComponent', () => {
  let component: LocationStepOneComponent;
  let fixture: ComponentFixture<LocationStepOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationStepOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
