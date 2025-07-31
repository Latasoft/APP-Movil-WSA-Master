import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalDetalleSubserviciosComponent } from './modal-detalle-subservicios.component';

describe('ModalDetalleSubserviciosComponent', () => {
  let component: ModalDetalleSubserviciosComponent;
  let fixture: ComponentFixture<ModalDetalleSubserviciosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetalleSubserviciosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDetalleSubserviciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
