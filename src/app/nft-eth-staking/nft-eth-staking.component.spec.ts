import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NftEthStakingComponent } from './nft-eth-staking.component';

describe('NftEthStakingComponent', () => {
  let component: NftEthStakingComponent;
  let fixture: ComponentFixture<NftEthStakingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NftEthStakingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NftEthStakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
