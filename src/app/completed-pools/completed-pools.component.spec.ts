import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedPoolsComponent } from './completed-pools.component';

describe('CompletedPoolsComponent', () => {
  let component: CompletedPoolsComponent;
  let fixture: ComponentFixture<CompletedPoolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedPoolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedPoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
