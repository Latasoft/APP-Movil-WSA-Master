import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpcionesUsuarioPoupoterComponent } from './opciones-usuario-poupoter.component';

describe('OpcionesUsuarioPoupoterComponent', () => {
  let component: OpcionesUsuarioPoupoterComponent;
  let fixture: ComponentFixture<OpcionesUsuarioPoupoterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OpcionesUsuarioPoupoterComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OpcionesUsuarioPoupoterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
