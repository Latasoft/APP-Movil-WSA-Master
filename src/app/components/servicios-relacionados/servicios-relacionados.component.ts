import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonItem, IonLabel, IonInput, IonTextarea, IonList, IonSelect, IonSelectOption,
  IonBadge, IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-servicios-relacionados',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonItem, IonLabel, IonInput, IonTextarea,
    IonList, IonSelect, IonSelectOption, IonBadge, IonButton
  ],
  templateUrl: './servicios-relacionados.component.html',
  styleUrls: ['./servicios-relacionados.component.scss']
})
export class ServiciosRelacionadosComponent {
  @Input() subServicios: any[] = [];
  @Input() serviciosDelSubservicio: any[] = [];
  @Input() serviciosRelacionados: any[] = [];
  @Input() subServicioSeleccionado: string = '';
  @Input() servicioRelacionadoSeleccionado: string = '';
  @Input() fechaServicioRelacionado: string = '';
  @Input() notaServicioRelacionado: string = '';

  @Output() seleccionarSubservicio = new EventEmitter<string>();
  @Output() seleccionarServicioRelacionado = new EventEmitter<string>();
  @Output() cambiarFecha = new EventEmitter<string>();
  @Output() cambiarNota = new EventEmitter<string>();
  @Output() anadirServicio = new EventEmitter<void>();
  @Output() actualizarEstado = new EventEmitter<number>();

  get serviciosRelacionadosFiltrados() {
    const filtro = this.servicioRelacionadoSeleccionado.toLowerCase().trim();
    return this.serviciosDelSubservicio.filter(s =>
      s.nombre.toLowerCase().includes(filtro)
    );
  }

  getColorEstado(estado: string): string {
    switch (estado) {
      case 'completado': return 'success';
      case 'en_proceso': return 'warning';
      case 'pendiente': return 'danger';
      default: return 'medium';
    }
  }
}
