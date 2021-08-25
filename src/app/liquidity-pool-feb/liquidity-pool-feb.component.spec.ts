import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidityPoolFebComponent } from './liquidity-pool-feb.component';

describe('LiquidityPoolFebComponent', () => {
  let component: LiquidityPoolFebComponent;
  let fixture: ComponentFixture<LiquidityPoolFebComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiquidityPoolFebComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidityPoolFebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
