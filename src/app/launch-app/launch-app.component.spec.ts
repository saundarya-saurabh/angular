import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchAppComponent } from './launch-app.component';

describe('LaunchAppComponent', () => {
  let component: LaunchAppComponent;
  let fixture: ComponentFixture<LaunchAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaunchAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
