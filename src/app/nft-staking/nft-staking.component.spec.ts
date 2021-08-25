import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NFTStakingComponent } from './nft-staking.component';

describe('NFTStakingComponent', () => {
  let component: NFTStakingComponent;
  let fixture: ComponentFixture<NFTStakingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NFTStakingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NFTStakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
