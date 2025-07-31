import { TestBed } from '@angular/core/testing';

import { EstructuraServiciosService } from './estructura-servicios.service';

describe('EstructuraServiciosService', () => {
  let service: EstructuraServiciosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstructuraServiciosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
