import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalCambiarFechaComponent } from './modal-cambiar-fecha.component';

describe('ModalCambiarFechaComponent', () => {
  let component: ModalCambiarFechaComponent;
  let fixture: ComponentFixture<ModalCambiarFechaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ModalCambiarFechaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCambiarFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
