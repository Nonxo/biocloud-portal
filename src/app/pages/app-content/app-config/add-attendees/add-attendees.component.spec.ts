import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttendeesComponent } from './add-attendees.component';

describe('AddAttendeesComponent', () => {
  let component: AddAttendeesComponent;
  let fixture: ComponentFixture<AddAttendeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAttendeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAttendeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
