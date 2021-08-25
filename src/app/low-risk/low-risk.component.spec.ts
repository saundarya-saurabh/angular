import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LowRiskComponent } from './low-risk.component';

describe('LowRiskComponent', () => {
  let component: LowRiskComponent;
  let fixture: ComponentFixture<LowRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LowRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LowRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
