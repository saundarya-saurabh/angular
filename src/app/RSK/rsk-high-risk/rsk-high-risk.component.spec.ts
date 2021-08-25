import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RskHighRiskComponent } from './rsk-high-risk.component';

describe('RskHighRiskComponent', () => {
  let component: RskHighRiskComponent;
  let fixture: ComponentFixture<RskHighRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RskHighRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RskHighRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
