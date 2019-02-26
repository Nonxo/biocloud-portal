import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LocationStepFourComponent} from './location-step-four.component';

describe('LocationStepFourComponent', () => {
  let component: LocationStepFourComponent;
  let fixture: ComponentFixture<LocationStepFourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationStepFourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationStepFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
