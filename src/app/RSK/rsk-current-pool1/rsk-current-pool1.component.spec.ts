import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RskCurrentPool1Component } from './rsk-current-pool1.component';

describe('RskCurrentPool1Component', () => {
  let component: RskCurrentPool1Component;
  let fixture: ComponentFixture<RskCurrentPool1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RskCurrentPool1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RskCurrentPool1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
