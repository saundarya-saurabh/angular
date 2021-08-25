import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleAsset1Component } from './bundle-asset1.component';

describe('BundleAsset1Component', () => {
  let component: BundleAsset1Component;
  let fixture: ComponentFixture<BundleAsset1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BundleAsset1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundleAsset1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
