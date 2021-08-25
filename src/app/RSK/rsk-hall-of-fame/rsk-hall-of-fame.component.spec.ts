import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RskHallOfFameComponent } from './rsk-hall-of-fame.component';

describe('RskHallOfFameComponent', () => {
  let component: RskHallOfFameComponent;
  let fixture: ComponentFixture<RskHallOfFameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RskHallOfFameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RskHallOfFameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
