import { TestBed } from '@angular/core/testing';

import { NotificacionPushService } from './notificacion-push.service';

describe('NotificacionPushService', () => {
  let service: NotificacionPushService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificacionPushService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
