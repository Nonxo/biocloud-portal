import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionCardDetailsComponent } from './subscription-card-details.component';

describe('SubscriptionCardDetailsComponent', () => {
  let component: SubscriptionCardDetailsComponent;
  let fixture: ComponentFixture<SubscriptionCardDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionCardDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
