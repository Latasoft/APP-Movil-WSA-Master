import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListaEmbarcacionesClienteComponent } from './lista-embarcaciones-cliente.component';

describe('ListaEmbarcacionesClienteComponent', () => {
  let component: ListaEmbarcacionesClienteComponent;
  let fixture: ComponentFixture<ListaEmbarcacionesClienteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaEmbarcacionesClienteComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaEmbarcacionesClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
