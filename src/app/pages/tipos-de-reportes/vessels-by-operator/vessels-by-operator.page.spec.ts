import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VesselsByOperatorPage } from './vessels-by-operator.page';

describe('VesselsByOperatorPage', () => {
  let component: VesselsByOperatorPage;
  let fixture: ComponentFixture<VesselsByOperatorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselsByOperatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
