import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RskCompletedPoolsComponent } from './rsk-completed-pools.component';

describe('RskCompletedPoolsComponent', () => {
  let component: RskCompletedPoolsComponent;
  let fixture: ComponentFixture<RskCompletedPoolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RskCompletedPoolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RskCompletedPoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
