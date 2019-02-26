import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LocationStepTwoComponent} from './location-step-two.component';

describe('LocationStepTwoComponent', () => {
  let component: LocationStepTwoComponent;
  let fixture: ComponentFixture<LocationStepTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationStepTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
