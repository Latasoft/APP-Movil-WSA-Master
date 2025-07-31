import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VesselsByCustomerPage } from './vessels-by-customer.page';

describe('VesselsByCustomerPage', () => {
  let component: VesselsByCustomerPage;
  let fixture: ComponentFixture<VesselsByCustomerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselsByCustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
