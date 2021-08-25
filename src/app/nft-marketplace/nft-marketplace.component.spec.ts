import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NftMarketplaceComponent } from './nft-marketplace.component';

describe('NftMarketplaceComponent', () => {
  let component: NftMarketplaceComponent;
  let fixture: ComponentFixture<NftMarketplaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NftMarketplaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NftMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
