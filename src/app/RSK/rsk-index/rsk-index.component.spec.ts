import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RskIndexComponent } from './rsk-index.component';

describe('RskIndexComponent', () => {
  let component: RskIndexComponent;
  let fixture: ComponentFixture<RskIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RskIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RskIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
