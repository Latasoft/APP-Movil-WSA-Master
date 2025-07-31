import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  ModalController } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonIcon,
  IonReorderGroup,
  IonReorder,
  IonBadge,
  IonInput,
  IonTextarea,
  IonCheckbox
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-accion-modal',
  templateUrl: './accion-modal.component.html',
  styleUrls: ['./accion-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonIcon,
    IonReorderGroup,
    IonReorder,
    IonBadge,
    IonInput,
    IonTextarea,
    IonCheckbox
  ]
})
export class AccionModalComponent implements OnInit {
  @Input() acciones: any[] = [];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    
    this.acciones.forEach((accion,i) => {
      // Si la acción YA trae una fecha, la formateamos a YYYY-MM-DD
      if (accion.fecha) {
        accion.fecha = this.formatDate(accion.fecha);
      } else {
        // Si no trae fecha, la dejas en '' (vacía)
        accion.fecha = '';
      }
  
      // Si no hay comentario, lo dejamos en vacío
      if (!accion.comentario) {
        accion.comentario = '';
      }
      if(accion.orden== null){
        accion.orden= i +1
      }
    });
  }
  private formatDate(fecha: Date | string): string {
    // si te llega un string con "2025-03-03T00:00:00.000Z", lo recortas a "2025-03-03"
    if (fecha instanceof Date) {
      return fecha.toISOString().split('T')[0];
    } else {
      return fecha.split('T')[0]; 
    }
  }

  confirmar() {
    // Ajustamos la propiedad orden según la posición
    this.acciones.forEach((accion, i) => accion.orden = i);

    
    // Cerrar el modal y devolver los datos
    this.modalCtrl.dismiss({ acciones: this.acciones }, 'confirm');
  }

  cancelar() {
    console.log('Cancelado sin cambios');
    this.modalCtrl.dismiss(null, 'cancel');
  }

  reorderActions(event: any) {
    
    const itemMovido = this.acciones.splice(event.detail.from, 1)[0];
    this.acciones.splice(event.detail.to, 0, itemMovido);

    event.detail.complete();
    
     // 4. Ahora re-numera TODAS las tarjetas
  this.acciones.forEach((accion, index) => {
    // index es 0-based, si quieres arrancar en 1, haz index + 1
    accion.orden = index + 1;
  });
  }
}
