import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPoolComponent } from './current-pool.component';

describe('CurrentPoolComponent', () => {
  let component: CurrentPoolComponent;
  let fixture: ComponentFixture<CurrentPoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentPoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
