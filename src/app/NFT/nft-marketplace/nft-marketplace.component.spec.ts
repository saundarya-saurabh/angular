import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NFTMarketplaceComponent } from './nft-marketplace.component';

describe('NFTMarketplaceComponent', () => {
  let component: NFTMarketplaceComponent;
  let fixture: ComponentFixture<NFTMarketplaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NFTMarketplaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NFTMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
