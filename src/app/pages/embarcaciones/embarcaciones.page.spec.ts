import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmbarcacionesPage } from './embarcaciones.page';

describe('EmbarcacionesPage', () => {
  let component: EmbarcacionesPage;
  let fixture: ComponentFixture<EmbarcacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbarcacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
