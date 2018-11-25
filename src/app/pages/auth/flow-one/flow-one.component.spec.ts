import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowOneComponent } from './flow-one.component';

describe('FlowOneComponent', () => {
  let component: FlowOneComponent;
  let fixture: ComponentFixture<FlowOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
