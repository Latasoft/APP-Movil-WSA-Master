import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonInput, IonTextarea, IonRadioGroup,
  IonRadio, IonLabel, IonItem, IonIcon,
  IonCard, IonCardContent, IonCheckbox
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-editar-servicio-modal',
  standalone: true,
  templateUrl: './editar-servicio-modal.component.html',
  styleUrls: ['./editar-servicio-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonInput, IonTextarea, IonRadioGroup,
    IonRadio, IonLabel, IonItem, IonIcon,
    IonCard, IonCardContent, IonCheckbox
  ]
})
export class EditarServicioModalComponent {
  @Input() nota: string = '';
  @Input() fecha: string = '';
  @Input() estado: string = 'pendiente';

  constructor(private modalCtrl: ModalController) {}

  cancelar() {
    this.modalCtrl.dismiss();
  }

  guardar() {
    this.modalCtrl.dismiss({
      nota: this.nota,
      fecha: this.fecha,
      estado: this.estado
    });
  }
}
