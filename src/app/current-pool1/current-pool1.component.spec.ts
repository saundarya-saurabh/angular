import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPool1Component } from './current-pool1.component';

describe('CurrentPool1Component', () => {
  let component: CurrentPool1Component;
  let fixture: ComponentFixture<CurrentPool1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentPool1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentPool1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
