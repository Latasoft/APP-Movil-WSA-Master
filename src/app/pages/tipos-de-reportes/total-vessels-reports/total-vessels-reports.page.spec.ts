import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TotalVesselsReportsPage } from './total-vessels-reports.page';

describe('TotalVesselsReportsPage', () => {
  let component: TotalVesselsReportsPage;
  let fixture: ComponentFixture<TotalVesselsReportsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalVesselsReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
