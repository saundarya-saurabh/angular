import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidityPoolNewComponent } from './liquidity-pool-new.component';

describe('LiquidityPoolNewComponent', () => {
  let component: LiquidityPoolNewComponent;
  let fixture: ComponentFixture<LiquidityPoolNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiquidityPoolNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidityPoolNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
