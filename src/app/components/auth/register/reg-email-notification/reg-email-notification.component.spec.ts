import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegEmailNotificationComponent } from './reg-email-notification.component';

describe('RegEmailNotificationComponent', () => {
  let component: RegEmailNotificationComponent;
  let fixture: ComponentFixture<RegEmailNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegEmailNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegEmailNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
