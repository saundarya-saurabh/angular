import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellNFTComponent } from './sell-nft.component';

describe('SellNFTComponent', () => {
  let component: SellNFTComponent;
  let fixture: ComponentFixture<SellNFTComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellNFTComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellNFTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
