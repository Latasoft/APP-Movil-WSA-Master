import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegistroSolicitudReporteComponent } from './registro-solicitud-reporte.component';

describe('RegistroSolicitudReporteComponent', () => {
  let component: RegistroSolicitudReporteComponent;
  let fixture: ComponentFixture<RegistroSolicitudReporteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroSolicitudReporteComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroSolicitudReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
