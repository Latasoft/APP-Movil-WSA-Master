import { TestBed } from '@angular/core/testing';

import { SolicitudReporteService } from './solicitud-reporte.service';

describe('SolicitudReporteService', () => {
  let service: SolicitudReporteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudReporteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
