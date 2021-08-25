import { TestBed } from '@angular/core/testing';

import { ApiRskService } from './api-rsk.service';

describe('ApiRskService', () => {
  let service: ApiRskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiRskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
