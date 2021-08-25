import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighRiskComponent } from './high-risk.component';

describe('HighRiskComponent', () => {
  let component: HighRiskComponent;
  let fixture: ComponentFixture<HighRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
