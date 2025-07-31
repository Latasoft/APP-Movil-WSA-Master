import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalServicioPrincipalComponent } from './modal-servicio-principal.component';

describe('ModalServicioPrincipalComponent', () => {
  let component: ModalServicioPrincipalComponent;
  let fixture: ComponentFixture<ModalServicioPrincipalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ModalServicioPrincipalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalServicioPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
