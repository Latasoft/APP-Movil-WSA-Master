import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicioRelacionadoFilterPipe } from 'src/app/pipes/servicio-relacionado-filter.pipe';
import { ToastController } from '@ionic/angular';
import { EstructuraServiciosService } from 'src/app/services/estructura-servicios.service';
import { ModalController, AlertController, IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonAccordionGroup,
  IonAccordion
  
 } from '@ionic/angular/standalone';


@Component({
  selector: 'app-detalle-servicio',
  templateUrl: './detalle-servicio.page.html',
  styleUrls: ['./detalle-servicio.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ServicioRelacionadoFilterPipe, IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonAccordionGroup,
  IonAccordion
  ]
})
export class DetalleServicioPage implements OnInit {
  @Input() servicioSeleccionado: any;
  busquedasServiciosRelacionados: string[] = [];

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private estructuraService: EstructuraServiciosService,
    private toastController: ToastController
  ) {}

  async mostrarToast(mensaje: string, color: string = 'success') {
  const toast = await this.toastController.create({
    message: mensaje,
    duration: 2000,
    color,
    position: 'top'
  });
  toast.present();
}


  ngOnInit() {
    console.log('✅ Modal DetalleServicioPage montado');
    this.busquedasServiciosRelacionados = this.servicioSeleccionado.subservicios.map(() => '');
  }

  cerrar() {
  this.modalController.dismiss({
    actualizado: true,
    servicioActualizado: this.servicioSeleccionado
  });
}
 
  async agregarSubservicio() {
    const alert = await this.alertController.create({
      header: 'Nuevo Subservicio',
      inputs: [{ name: 'nombre', type: 'text', placeholder: 'Nombre del subservicio' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Agregar',
          handler: (data) => {
            if (data.nombre.trim()) {
              this.servicioSeleccionado.subservicios.push({ nombre: data.nombre.trim(), servicios: [] });
              this.busquedasServiciosRelacionados.push('');
            }
          }
        }
      ]
    });

    await alert.present();
  }

async agregarServicioRelacionado(j: number) {
  const alert = await this.alertController.create({
    header: 'Nuevo Servicio Relacionado',
    inputs: [{ name: 'nombre', type: 'text', placeholder: 'Nombre del servicio' }],
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Agregar',
        handler: (data) => {
          const nuevoNombre = data.nombre.trim();

          if (!nuevoNombre) {
            this.mostrarToast('Nombre inválido', 'warning');
            return false; // evita cerrar el alert si está vacío
          }

          const nuevo = { nombre: nuevoNombre };
          const principal = this.servicioSeleccionado.principal;
          const subservicio = this.servicioSeleccionado.subservicios[j].nombre;

          this.estructuraService.agregarServicioRelacionado(principal, subservicio, nuevo).subscribe({
            next: () => {
              this.servicioSeleccionado.subservicios[j].servicios.push(nuevo); // visual
              this.mostrarToast('Servicio agregado correctamente');
            },
            error: (err) => {
              console.error('Error al guardar en backend:', err);
              this.mostrarToast('Error al guardar el servicio', 'danger');
            }
          });
          return true;
        }
      }
    ]
  });

  await alert.present();
}



  async editarSubservicio(j: number) {
    const sub = this.servicioSeleccionado.subservicios[j];
    const alert = await this.alertController.create({
      header: 'Editar Subservicio',
      inputs: [{ name: 'nombre', type: 'text', value: sub.nombre }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            sub.nombre = data.nombre.trim();
          }
        }
      ]
    });

    await alert.present();
  }

  async editarServicioRelacionado(j: number, k: number) {
  const subservicio = this.servicioSeleccionado.subservicios[j];
  const servicioActual = subservicio.servicios[k];

  const alert = await this.alertController.create({
    header: 'Editar Servicio Relacionado',
    inputs: [
      {
        name: 'nombre',
        type: 'text',
        placeholder: 'Nombre del servicio',
        value: servicioActual.nombre
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
          const nuevoNombre = data.nombre.trim();
          if (!nuevoNombre || nuevoNombre === servicioActual.nombre) {
            return; // no se actualiza si está vacío o no cambia
          }

          const principal = this.servicioSeleccionado.principal;
          const subNombre = subservicio.nombre;

          this.estructuraService.editarServicioRelacionado(principal, subNombre, servicioActual.nombre, nuevoNombre).subscribe({
            next: () => {
              subservicio.servicios[k].nombre = nuevoNombre;
              this.mostrarToast('Servicio editado correctamente');
            },
            error: (err) => {
              console.error('Error al editar servicio:', err);
              this.mostrarToast('Error al editar', 'danger');
            }
          });
        }
      }
    ]
  });

  await alert.present();
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

          const nombreServicio = servicio.nombre.trim(); // eliminamos espacios innecesarios
          this.estructuraService.eliminarServicioRelacionadoPorId(principal, subNombre, servicio._id).subscribe({
            next: () => {
              // Luego de eliminar, obtenemos la estructura actualizada
              this.estructuraService.obtenerEstructura().subscribe({
                next: (estructura) => {
                  if (Array.isArray(estructura)) {
                      const actualizado = estructura.find((s: any) => s.principal === principal);
                      if (actualizado) {
                        this.servicioSeleccionado = actualizado;
                      } else {
                        this.mostrarToast('No se encontró la estructura actualizada', 'warning');
                      }
                    } else {
                      this.mostrarToast('Error: respuesta inesperada del servidor', 'danger');
                    }

                  this.mostrarToast('Servicio eliminado correctamente');
                },
                error: () => {
                  this.mostrarToast('Error al actualizar la vista', 'danger');
                }
              });
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


async eliminarSubservicio(j: number) {
  const subservicio = this.servicioSeleccionado.subservicios[j].nombre;

  const alert = await this.alertController.create({
    header: '¿Eliminar Subservicio?',
    message: `Se eliminará el subservicio "${subservicio}" y todos sus servicios relacionados.`,
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Eliminar',
        role: 'destructive',
        handler: () => {
          this.estructuraService.eliminarSubservicio(this.servicioSeleccionado.principal, subservicio)
            .subscribe({
              next: () => {
                this.servicioSeleccionado.subservicios.splice(j, 1);
                this.mostrarToast('Subservicio eliminado', 'danger');
              },
              error: () => {
                this.mostrarToast('Error al eliminar subservicio', 'danger');
              }
            });
        }
      }
    ]
  });

  await alert.present();
}



}
