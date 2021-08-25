import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RskBundleAssetComponent } from './rsk-bundle-asset.component';

describe('RskBundleAssetComponent', () => {
  let component: RskBundleAssetComponent;
  let fixture: ComponentFixture<RskBundleAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RskBundleAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RskBundleAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
