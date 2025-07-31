import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VesselsReportsPage } from './vessels-reports.page';

describe('VesselsReportsPage', () => {
  let component: VesselsReportsPage;
  let fixture: ComponentFixture<VesselsReportsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselsReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
