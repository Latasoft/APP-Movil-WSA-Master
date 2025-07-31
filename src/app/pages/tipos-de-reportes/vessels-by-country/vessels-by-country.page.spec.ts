import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VesselsByCountryPage } from './vessels-by-country.page';

describe('VesselsByCountryPage', () => {
  let component: VesselsByCountryPage;
  let fixture: ComponentFixture<VesselsByCountryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselsByCountryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
