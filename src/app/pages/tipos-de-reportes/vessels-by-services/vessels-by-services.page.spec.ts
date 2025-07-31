import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VesselsByServicesPage } from './vessels-by-services.page';

describe('VesselsByServicesPage', () => {
  let component: VesselsByServicesPage;
  let fixture: ComponentFixture<VesselsByServicesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselsByServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
