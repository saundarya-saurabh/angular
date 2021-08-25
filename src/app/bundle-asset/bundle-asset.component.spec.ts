import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleAssetComponent } from './bundle-asset.component';

describe('BundleAssetComponent', () => {
  let component: BundleAssetComponent;
  let fixture: ComponentFixture<BundleAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BundleAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundleAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
