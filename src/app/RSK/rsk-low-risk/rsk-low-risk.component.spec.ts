import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RskLowRiskComponent } from './rsk-low-risk.component';

describe('RskLowRiskComponent', () => {
  let component: RskLowRiskComponent;
  let fixture: ComponentFixture<RskLowRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RskLowRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RskLowRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
