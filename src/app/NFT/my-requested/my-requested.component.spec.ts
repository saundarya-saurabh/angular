import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRequestedComponent } from './my-requested.component';

describe('MyRequestedComponent', () => {
  let component: MyRequestedComponent;
  let fixture: ComponentFixture<MyRequestedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyRequestedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRequestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
