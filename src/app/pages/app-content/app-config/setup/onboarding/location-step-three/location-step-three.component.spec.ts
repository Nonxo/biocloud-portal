import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LocationStepThreeComponent} from './location-step-three.component';

describe('LocationStepThreeComponent', () => {
  let component: LocationStepThreeComponent;
  let fixture: ComponentFixture<LocationStepThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationStepThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
