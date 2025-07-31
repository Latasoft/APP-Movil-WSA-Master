import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalActualizarEmbarcacionComponent } from './modal-actualizar-embarcacion.component';

describe('ModalActualizarEmbarcacionComponent', () => {
  let component: ModalActualizarEmbarcacionComponent;
  let fixture: ComponentFixture<ModalActualizarEmbarcacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalActualizarEmbarcacionComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalActualizarEmbarcacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
