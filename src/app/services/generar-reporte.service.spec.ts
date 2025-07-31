import { TestBed } from '@angular/core/testing';

import { GenerarReporteService } from './generar-reporte.service';

describe('GenerarReporteService', () => {
  let service: GenerarReporteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerarReporteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
