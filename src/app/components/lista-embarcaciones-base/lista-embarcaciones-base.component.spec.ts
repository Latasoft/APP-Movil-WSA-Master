import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListaEmbarcacionesBaseComponent } from './lista-embarcaciones-base.component';

describe('ListaEmbarcacionesBaseComponent', () => {
  let component: ListaEmbarcacionesBaseComponent;
  let fixture: ComponentFixture<ListaEmbarcacionesBaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaEmbarcacionesBaseComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaEmbarcacionesBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
