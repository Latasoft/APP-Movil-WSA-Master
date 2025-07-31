import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpcionesEmbarcacionPoupoterComponent } from './opciones-embarcacion-poupoter.component';

describe('OpcionesEmbarcacionPoupoterComponent', () => {
  let component: OpcionesEmbarcacionPoupoterComponent;
  let fixture: ComponentFixture<OpcionesEmbarcacionPoupoterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OpcionesEmbarcacionPoupoterComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OpcionesEmbarcacionPoupoterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
