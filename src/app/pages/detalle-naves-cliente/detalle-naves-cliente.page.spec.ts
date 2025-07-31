import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleNavesClientePage } from './detalle-naves-cliente.page';

describe('DetalleNavesClientePage', () => {
  let component: DetalleNavesClientePage;
  let fixture: ComponentFixture<DetalleNavesClientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleNavesClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
