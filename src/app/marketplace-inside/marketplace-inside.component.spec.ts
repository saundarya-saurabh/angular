import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceInsideComponent } from './marketplace-inside.component';

describe('MarketplaceInsideComponent', () => {
  let component: MarketplaceInsideComponent;
  let fixture: ComponentFixture<MarketplaceInsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceInsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceInsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
