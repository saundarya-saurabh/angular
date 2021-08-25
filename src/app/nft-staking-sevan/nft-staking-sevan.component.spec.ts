import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NftStakingSevanComponent } from './nft-staking-sevan.component';

describe('NftStakingSevanComponent', () => {
  let component: NftStakingSevanComponent;
  let fixture: ComponentFixture<NftStakingSevanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NftStakingSevanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NftStakingSevanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
