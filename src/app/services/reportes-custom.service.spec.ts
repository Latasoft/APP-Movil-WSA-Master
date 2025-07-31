import { TestBed } from '@angular/core/testing';

import { ReportesCustomService } from './reportes-custom.service';

describe('ReportesCustomService', () => {
  let service: ReportesCustomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportesCustomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
