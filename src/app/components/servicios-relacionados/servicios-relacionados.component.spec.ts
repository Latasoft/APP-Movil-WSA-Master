import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServiciosRelacionadosComponent } from './servicios-relacionados.component';

describe('ServiciosRelacionadosComponent', () => {
  let component: ServiciosRelacionadosComponent;
  let fixture: ComponentFixture<ServiciosRelacionadosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ServiciosRelacionadosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiciosRelacionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
