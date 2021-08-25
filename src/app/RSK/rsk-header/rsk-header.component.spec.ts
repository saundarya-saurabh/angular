import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RskHeaderComponent } from './rsk-header.component';

describe('RskHeaderComponent', () => {
  let component: RskHeaderComponent;
  let fixture: ComponentFixture<RskHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RskHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RskHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
