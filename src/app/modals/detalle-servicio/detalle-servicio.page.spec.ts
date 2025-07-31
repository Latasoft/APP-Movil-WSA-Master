import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleServicioPage } from './detalle-servicio.page';

describe('DetalleServicioPage', () => {
  let component: DetalleServicioPage;
  let fixture: ComponentFixture<DetalleServicioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleServicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
