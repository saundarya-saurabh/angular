import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RskCurrentPoolComponent } from './rsk-current-pool.component';

describe('RskCurrentPoolComponent', () => {
  let component: RskCurrentPoolComponent;
  let fixture: ComponentFixture<RskCurrentPoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RskCurrentPoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RskCurrentPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
