import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpAsComponent } from './sign-up-as.component';

describe('SignUpAsComponent', () => {
  let component: SignUpAsComponent;
  let fixture: ComponentFixture<SignUpAsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpAsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpAsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
