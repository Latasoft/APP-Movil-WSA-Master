import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  IonDatetime,
  IonButton,
  IonItem,
  IonLabel,
  IonContent
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-cambiar-fecha',
  templateUrl: './modal-cambiar-fecha.component.html',
  styleUrls: ['./modal-cambiar-fecha.component.scss'],
  standalone: true,
  imports: [
    IonDatetime,
    IonButton,
    IonItem,
    IonLabel,
    IonContent,
    FormsModule
  ]
})
export class ModalCambiarFechaComponent {
  @Input() fechaActual: string = '';
  nuevaFecha: string = '';

  constructor(private modalCtrl: ModalController) {}

  cerrar() {
    this.modalCtrl.dismiss();
  }

  guardar() {
    if (!this.nuevaFecha) return;
    const fechaFormateada = new Date(this.nuevaFecha).toISOString();
    this.modalCtrl.dismiss({ fechaSeleccionada: fechaFormateada });
  }
}
