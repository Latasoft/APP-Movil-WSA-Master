import { TestBed } from '@angular/core/testing';

import { EmbarcacionesService } from './embarcaciones.service';

describe('EmbarcacionesService', () => {
  let service: EmbarcacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmbarcacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
