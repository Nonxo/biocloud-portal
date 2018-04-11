import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAttendeesComponent } from './group-attendees.component';

describe('GroupAttendeesComponent', () => {
  let component: GroupAttendeesComponent;
  let fixture: ComponentFixture<GroupAttendeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupAttendeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAttendeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
