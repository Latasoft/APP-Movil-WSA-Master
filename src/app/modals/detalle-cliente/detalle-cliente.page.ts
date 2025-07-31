import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.page.html',
  styleUrls: ['./detalle-cliente.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DetalleClientePage {
  @Input() empresa: any;

  constructor(private modalCtrl: ModalController) {}

  cerrar() {
    this.modalCtrl.dismiss();
  }
}
