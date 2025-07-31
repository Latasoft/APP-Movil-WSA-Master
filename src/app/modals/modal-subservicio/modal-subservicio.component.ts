import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { ModalServicioRelacionadoComponent } from '../modal-servicio-relacionado/modal-servicio-relacionado.component';

@Component({
  selector: 'app-modal-subservicio',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './modal-subservicio.component.html',
  styleUrls: ['./modal-subservicio.component.scss']
})
export class ModalSubservicioComponent {
  @Input() subservicios: { nombre: string; servicios: { nombre: string }[] }[] = [];


  constructor(private modalCtrl: ModalController) {}


  cerrarModal() {
    this.modalCtrl.dismiss();
  }
  async seleccionar(subservicio: any) {
    console.log('🟢 Subservicio seleccionado:', subservicio);
    if (!subservicio.servicios || subservicio.servicios.length === 0) {
      // 🚀 Si no tiene campos, lo devolvemos como campo y subservicio
      this.modalCtrl.dismiss({ campo: subservicio.nombre, subservicio: subservicio.nombre });
      return;
    }

    // ✅ Si tiene servicios relacionados, abrir modal para elegir uno
    const modal = await this.modalCtrl.create({
      component: ModalServicioRelacionadoComponent,
      componentProps: {
        servicios: subservicio.servicios  
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data && data.campo) {
      this.modalCtrl.dismiss({ campo: data.campo, subservicio: subservicio.nombre });
    }
  }

}