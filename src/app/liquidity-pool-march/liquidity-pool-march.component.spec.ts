import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidityPoolMarchComponent } from './liquidity-pool-march.component';

describe('LiquidityPoolMarchComponent', () => {
  let component: LiquidityPoolMarchComponent;
  let fixture: ComponentFixture<LiquidityPoolMarchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiquidityPoolMarchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidityPoolMarchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
