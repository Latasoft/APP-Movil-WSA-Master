import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleNavePanelClientePage } from './detalle-nave-panel-cliente.page';

describe('DetalleNavePanelClientePage', () => {
  let component: DetalleNavePanelClientePage;
  let fixture: ComponentFixture<DetalleNavePanelClientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleNavePanelClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
