import { TestBed } from '@angular/core/testing';

import { RegistroReporteService } from './registro-reporte.service';

describe('RegistroReporteService', () => {
  let service: RegistroReporteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroReporteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
