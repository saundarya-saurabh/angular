import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RskHeader1Component } from './rsk-header1.component';

describe('RskHeader1Component', () => {
  let component: RskHeader1Component;
  let fixture: ComponentFixture<RskHeader1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RskHeader1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RskHeader1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
