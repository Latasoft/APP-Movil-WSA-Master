import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-servicio-relacionado',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './modal-servicio-relacionado.component.html',
  styleUrls: ['./modal-servicio-relacionado.component.scss']
})
export class ModalServicioRelacionadoComponent {
  @Input() servicios: { nombre: string }[] = [];

  busqueda: string = '';
  campoSeleccionado: string | null = null;

  constructor(private modalCtrl: ModalController) {
    console.log('🟡 Campos recibidos en modal-servicio-relacionado:', this.servicios);
  }

  get serviciosFiltrados(): { nombre: string }[] {
    const texto = this.busqueda.trim().toLowerCase();
    return this.servicios.filter(s =>
      s.nombre.toLowerCase().includes(texto)
    );
  }

  seleccionar(nombre: string) {
    this.campoSeleccionado = nombre;
    console.log('🔵 Campo seleccionado:', nombre);
  }

agregarCampo() {
  this.modalCtrl.dismiss({ campo: this.campoSeleccionado });
}


  cerrarModal() {
    this.modalCtrl.dismiss();
  }
}
