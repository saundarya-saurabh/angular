import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NftStakingTwoComponent } from './nft-staking-two.component';

describe('NftStakingTwoComponent', () => {
  let component: NftStakingTwoComponent;
  let fixture: ComponentFixture<NftStakingTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NftStakingTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NftStakingTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
