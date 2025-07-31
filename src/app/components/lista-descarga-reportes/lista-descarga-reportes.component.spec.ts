import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListaDescargaReportesComponent } from './lista-descarga-reportes.component';

describe('ListaDescargaReportesComponent', () => {
  let component: ListaDescargaReportesComponent;
  let fixture: ComponentFixture<ListaDescargaReportesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaDescargaReportesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaDescargaReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
