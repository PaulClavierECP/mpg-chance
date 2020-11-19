import { TestBed } from '@angular/core/testing';

import { SimulService } from './simul.service';

describe('PointsService', () => {
  let service: SimulService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
