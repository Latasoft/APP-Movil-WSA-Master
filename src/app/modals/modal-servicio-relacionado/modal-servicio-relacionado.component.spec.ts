import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalServicioRelacionadoComponent } from './modal-servicio-relacionado.component';

describe('ModalServicioRelacionadoComponent', () => {
  let component: ModalServicioRelacionadoComponent;
  let fixture: ComponentFixture<ModalServicioRelacionadoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ModalServicioRelacionadoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalServicioRelacionadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
