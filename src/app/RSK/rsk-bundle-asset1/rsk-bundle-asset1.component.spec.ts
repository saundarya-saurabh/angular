import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RskBundleAsset1Component } from './rsk-bundle-asset1.component';

describe('RskBundleAsset1Component', () => {
  let component: RskBundleAsset1Component;
  let fixture: ComponentFixture<RskBundleAsset1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RskBundleAsset1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RskBundleAsset1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
