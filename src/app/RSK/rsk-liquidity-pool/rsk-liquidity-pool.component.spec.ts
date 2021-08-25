import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RskLiquidityPoolComponent } from './rsk-liquidity-pool.component';

describe('RskLiquidityPoolComponent', () => {
  let component: RskLiquidityPoolComponent;
  let fixture: ComponentFixture<RskLiquidityPoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RskLiquidityPoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RskLiquidityPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
