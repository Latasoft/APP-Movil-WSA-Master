import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ModalController, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { EstructuraServiciosService } from 'src/app/services/estructura-servicios.service';
import { ServicioFilterPipe } from 'src/app/pipes/servicio-filter.pipe';
import { ServicioRelacionadoFilterPipe } from 'src/app/pipes/servicio-relacionado-filter.pipe';
import { DetalleServicioPage } from 'src/app/modals/detalle-servicio/detalle-servicio.page';

@Component({
  selector: 'app-servicios',
  standalone: true,
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ServicioFilterPipe,
    ServicioRelacionadoFilterPipe,
    DetalleServicioPage
  ]
})
export class ServiciosPage implements OnInit {
  serviciosEstructurados: any[] = [];
  busqueda: string = '';
  busquedasServiciosRelacionados: string[][] = [];
  servicioSeleccionado: any;

  constructor(
    private estructuraService: EstructuraServiciosService,
    private alertController: AlertController,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cargarServicios();
  }

  cargarServicios() {
    this.estructuraService.obtenerEstructura().subscribe({
      next: (data: any) => {
        this.serviciosEstructurados = data;
        this.busquedasServiciosRelacionados = data.map((servicio: any) =>
          servicio.subservicios.map(() => '')
        );
      },
      error: (err: any) => {
        console.error('❌ Error al cargar la estructura:', err.error || err.message || err);
        if (err.status === 401) {
          console.warn('⚠️ No autorizado. Verifica el token JWT.');
        } else if (err.status === 0) {
          console.warn('⚠️ No se pudo conectar al servidor. Revisa conexión o CORS.');
        }
      }
    });
  }

  eliminarServicioPrincipal(index: number) {
    this.serviciosEstructurados.splice(index, 1);
  }

  eliminarSubservicio(servicioIndex: number, subIndex: number) {
    this.serviciosEstructurados[servicioIndex].subservicios.splice(subIndex, 1);
  }

  async eliminarServicioRelacionado(j: number, k: number) {
    const subservicio = this.servicioSeleccionado.subservicios[j];
    const servicio = subservicio.servicios[k];

    const alert = await this.alertController.create({
      header: '¿Eliminar Servicio?',
      message: `¿Estás seguro que deseas eliminar <strong>${servicio.nombre}</strong>?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            const principal = this.servicioSeleccionado.principal;
            const subNombre = subservicio.nombre;
            const idServicio = servicio._id;

            this.estructuraService.eliminarServicioRelacionadoPorId(principal, subNombre, idServicio).subscribe({
              next: () => {
                subservicio.servicios.splice(k, 1);
                this.mostrarToast('Servicio eliminado correctamente');
              },
              error: (err) => {
                console.error('Error al eliminar:', err);
                this.mostrarToast('Error al eliminar', 'danger');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async editarServicio(i: number) {
    const servicio = this.serviciosEstructurados[i];

    const alert = await this.alertController.create({
      header: 'Editar Servicio Principal',
      inputs: [
        {
          name: 'principal',
          type: 'text',
          value: servicio.principal,
          placeholder: 'Nombre del servicio principal'
        },
        {
          name: 'subtitulo',
          type: 'text',
          value: servicio.subtitulo,
          placeholder: 'Subtítulo del servicio'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            servicio.principal = data.principal.trim();
            servicio.subtitulo = data.subtitulo.trim();
          }
        }
      ]
    });

    await alert.present();
  }

  async agregar() {
    const alert = await this.alertController.create({
      header: 'Nuevo Servicio Principal',
      inputs: [
        {
          name: 'principal',
          type: 'text',
          placeholder: 'Nombre del servicio principal'
        },
        {
          name: 'subtitulo',
          type: 'text',
          placeholder: 'Subtítulo del servicio'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: (data) => {
            if (data.principal.trim() !== '' && data.subtitulo.trim() !== '') {
              const nuevoServicio = {
                principal: data.principal.trim(),
                subtitulo: data.subtitulo.trim(),
                subservicios: []
              };
              this.serviciosEstructurados.push(nuevoServicio);
              this.busquedasServiciosRelacionados.push([]);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async agregarSubservicio(index: number) {
    const alert = await this.alertController.create({
      header: 'Nuevo Subservicio',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del subservicio'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: (data) => {
            if (data.nombre.trim() !== '') {
              const nuevoSubservicio = {
                nombre: data.nombre.trim(),
                servicios: []
              };
              this.serviciosEstructurados[index].subservicios.push(nuevoSubservicio);
              this.busquedasServiciosRelacionados[index].push('');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async abrirModalDetalle(servicio: any) {
    const modal = await this.modalController.create({
      component: DetalleServicioPage,
      componentProps: {
        servicioSeleccionado: { ...servicio }
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.actualizado) {
      const index = this.serviciosEstructurados.findIndex(s => s._id === servicio._id);
      if (index !== -1) {
        this.serviciosEstructurados[index] = data.servicioActualizado;
      }
    }
  }

  async mostrarToast(mensaje: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color,
      position: 'top'
    });
    toast.present();
  }
}
