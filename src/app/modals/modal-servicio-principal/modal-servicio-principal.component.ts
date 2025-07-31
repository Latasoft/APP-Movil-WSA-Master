import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, IonButton, IonList, IonItem, IonLabel } from '@ionic/angular';

@Component({
  selector: 'app-modal-servicio-principal',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './modal-servicio-principal.component.html',
  styleUrls: ['./modal-servicio-principal.component.scss']
})
export class ModalServicioPrincipalComponent {
  // ✅ Esperamos un array completo con principal y subtitulo
  @Input() servicios: { principal: string; subtitulo?: string }[] = [];


  constructor(private modalCtrl: ModalController) {}

  seleccionar(servicio: { principal: string }) {
    this.modalCtrl.dismiss(servicio.principal); // Devolvemos solo el nombre
  }

  cerrarModal() {
  this.modalCtrl.dismiss();
}

}
