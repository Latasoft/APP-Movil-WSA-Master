import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalSubservicioComponent } from './modal-subservicio.component';

describe('ModalSubservicioComponent', () => {
  let component: ModalSubservicioComponent;
  let fixture: ComponentFixture<ModalSubservicioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ModalSubservicioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalSubservicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
