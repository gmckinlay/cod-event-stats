import { TestBed } from '@angular/core/testing';

import { MwstatsService } from './mwstats.service';

describe('MwstatsService', () => {
  let service: MwstatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MwstatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
