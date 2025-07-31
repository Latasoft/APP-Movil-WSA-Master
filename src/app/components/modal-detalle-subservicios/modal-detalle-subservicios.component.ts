import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonPopover,
  AlertController,
  PopoverController,
  ModalController,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popover-content',
  standalone: true,
  template: `
    <ion-content class="ion-padding">
      <p>{{ nota }}</p>
    </ion-content>
  `,
  imports: [IonContent, CommonModule]
})
export class PopoverContentComponent {
  @Input() nota: string = '';
}

@Component({
  selector: 'app-modal-detalle-subservicios',
  standalone: true,
  templateUrl: './modal-detalle-subservicios.component.html',
  styleUrls: ['./modal-detalle-subservicios.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonPopover,
    PopoverContentComponent,
  ],
})
export class ModalDetalleSubserviciosComponent {
  @Input() subservices: any[] = [];
  @Input() mainServiceName: string = '';

  constructor(
    private popoverController: PopoverController,
    private modalController: ModalController
  ) {}

  close() {
    this.modalController.dismiss();
  }

  confirmarSeleccion() {
    const seleccionados = this.subservices.filter(s => s.selected);
    this.modalController.dismiss(seleccionados);
  }

  formatDate(date: string): string {
    if (!date) return '-';
    return date.substring(0, 10);
  }

  getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'completado':
      return 'status-completed';
    case 'pendiente':
      return 'status-pending';
    case 'en_progreso':
      return 'status-inprogress';
    default:
      return 'status-medium';
  }
}


  async verNota(nota: string, ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverContentComponent,
      componentProps: { nota: nota || 'No hay nota.' },
      event: ev,
      translucent: true,
      showBackdrop: true
    });
    await popover.present();
  }

  toggleAccordion(index: number) {
    this.subservices[index].expanded = !this.subservices[index].expanded;
  }

  getCompletedCount(): number {
    return this.subservices.filter(s => s.estado?.toLowerCase() === 'completado').length;
  }

  getPendingCount(): number {
    return this.subservices.filter(s => s.estado?.toLowerCase() === 'pendiente').length;
  }

  getProgressClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completado':
        return 'progress-completed';
      case 'en_progreso':
        return 'progress-inprogress';
      case 'pendiente':
        return 'progress-pending';
      default:
        return 'progress-default';
    }
  }
}
