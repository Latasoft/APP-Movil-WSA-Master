import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmpresaOpcionesPopoverComponent } from './empresa-opciones-popover.component';

describe('EmpresaOpcionesPopoverComponent', () => {
  let component: EmpresaOpcionesPopoverComponent;
  let fixture: ComponentFixture<EmpresaOpcionesPopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EmpresaOpcionesPopoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpresaOpcionesPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
