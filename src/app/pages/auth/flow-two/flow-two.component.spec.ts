import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowTwoComponent } from './flow-two.component';

describe('FlowTwoComponent', () => {
  let component: FlowTwoComponent;
  let fixture: ComponentFixture<FlowTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
