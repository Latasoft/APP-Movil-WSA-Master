import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { EmbarcacionesService } from 'src/app/services/embarcaciones.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditarServicioModalComponent } from '../editar-servicio-modal/editar-servicio-modal.component';
import { IonNote } from '@ionic/angular/standalone';
import { ClienteService } from 'src/app/services/cliente.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonGrid, IonRow, IonCol, IonItem, IonLabel, IonSelect, IonSelectOption,
  IonList, IonIcon, IonBadge, IonInput, IonTextarea, IonDatetime, IonDatetimeButton,
  IonModal, IonAccordion, IonAccordionGroup, IonReorder, IonReorderGroup
} from '@ionic/angular/standalone';

import { ModalServicioPrincipalComponent } from '../modal-servicio-principal/modal-servicio-principal.component';
import { ModalSubservicioComponent } from '../modal-subservicio/modal-subservicio.component';

@Component({
  selector: 'app-modal-actualizar-embarcacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonGrid, IonRow, IonCol, IonItem, IonLabel, IonSelect, IonSelectOption,
    IonList, IonIcon, IonBadge, IonInput, IonTextarea, IonDatetime, IonDatetimeButton,
    IonModal, IonAccordion, IonAccordionGroup, IonReorder, IonReorderGroup,  IonNote,
  ],
  templateUrl: './modal-actualizar-embarcacion.component.html',
  styleUrls: ['./modal-actualizar-embarcacion.component.scss']
})
export class ModalActualizarEmbarcacionComponent implements OnInit, OnChanges {
  @Input() embarcacion: any;
  @Input() esAdmin: boolean = false;
  @Input() puedeEditarFechas: boolean = true;
  @Input() serviciosEstructurados: any[] = [];

  serviciosRelacionadosSeleccionados: {
    [principal: string]: {
      nombre: string;
      subservicio?: string;
      fecha: string;
      nota: string;
      estado: string;
      servicio_principal: string;
      fecha_modificacion?: string;
    }[];
  } = {};

  clienteNombre: string = '';

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private embarcacionesService: EmbarcacionesService,
    private clienteService: ClienteService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit() {
  // ✅ Mapear las fechas de la base de datos a los campos esperados en la vista
  this.embarcacion.eta = this.convertirFechaLocal(this.embarcacion.fecha_arribo) || null;
  this.embarcacion.etb = this.convertirFechaLocal(this.embarcacion.fecha_estimada_zarpe) || null;
  this.embarcacion.etd = this.convertirFechaLocal(this.embarcacion.fecha_zarpe) || null;

  // ✅ Garantizar que siempre existan las propiedades aunque sean nulas
  if (!this.embarcacion.hasOwnProperty('eta')) {
    this.embarcacion.eta = null;
  }
  if (!this.embarcacion.hasOwnProperty('etb')) {
    this.embarcacion.etb = null;
  }
  if (!this.embarcacion.hasOwnProperty('etd')) {
    this.embarcacion.etd = null;
  }

  // ✅ Cargar servicios relacionados si existen
  if (Array.isArray(this.embarcacion.servicios_relacionados)) {
    for (const servicio of this.embarcacion.servicios_relacionados) {
      const principal = servicio.servicio_principal?.trim() || servicio.nombre?.trim() || 'Otro';
      if (!this.serviciosRelacionadosSeleccionados[principal]) {
        this.serviciosRelacionadosSeleccionados[principal] = [];
      }
      // Buscar el subservicio real si no viene en el campo subservicio
      let subservicio = servicio.subservicio || '';
      if (!subservicio && this.serviciosEstructurados && principal) {
        const estructura = this.serviciosEstructurados.find(s => s.principal === principal);
        if (estructura && estructura.subservicios) {
          const encontrado = estructura.subservicios.find((sub: any) => sub.nombre === servicio.nombre);
          if (encontrado) {
            subservicio = servicio.nombre;
          }
        }
      }
      this.serviciosRelacionadosSeleccionados[principal].push({
        nombre: servicio.nombre || '',
        subservicio: subservicio,
        fecha: servicio.fecha || '',
        nota: servicio.nota || '',
        estado: servicio.estado || 'pendiente',
        fecha_modificacion: servicio.fecha_modificacion || '',
        servicio_principal: principal
      });
    }
  }

  // Cargar servicios de la propiedad 'servicios' (registro)
  if (Array.isArray(this.embarcacion.servicios)) {
    for (const servicio of this.embarcacion.servicios) {
      const principal = servicio.nombre_servicio?.trim() || 'Otro';
      if (!this.serviciosRelacionadosSeleccionados[principal]) {
        this.serviciosRelacionadosSeleccionados[principal] = [];
      }
      // Agregar cada estado como subservicio
      for (const estado of servicio.estados || []) {
        this.serviciosRelacionadosSeleccionados[principal].push({
          nombre: estado.nombre_estado || '',
          subservicio: '',
          fecha: '',
          nota: '',
          estado: 'pendiente',
          fecha_modificacion: '',
          servicio_principal: principal
        });
      }
    }
  }

  // Buscar el username del cliente asociado (usuario)
  const clienteId = this.embarcacion?.clientes?.[0]?.cliente_id;
  if (clienteId) {
    this.usuariosService.getUserById(clienteId).subscribe({
      next: (resp) => {
        this.clienteNombre = resp.userResponse?.username || 'Sin cliente';
      },
      error: () => {
        this.clienteNombre = 'Sin cliente';
      }
    });
  } else {
    this.clienteNombre = 'Sin cliente';
  }
}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['serviciosEstructurados'] && this.serviciosEstructurados && this.embarcacion) {
      this.reconstruirServiciosRelacionados();
    }
  }

  reconstruirServiciosRelacionados() {
    this.serviciosRelacionadosSeleccionados = {};
    if (Array.isArray(this.embarcacion.servicios_relacionados)) {
      for (const servicio of this.embarcacion.servicios_relacionados) {
        const principal = servicio.servicio_principal?.trim() || servicio.nombre?.trim() || 'Otro';
        if (!this.serviciosRelacionadosSeleccionados[principal]) {
          this.serviciosRelacionadosSeleccionados[principal] = [];
        }
        // Buscar el subservicio real si no viene en el campo subservicio
        let subservicio = servicio.subservicio || '';
        if (!subservicio && this.serviciosEstructurados && principal) {
          const estructura = this.serviciosEstructurados.find(s => s.principal === principal);
          if (estructura && estructura.subservicios) {
            const encontrado = estructura.subservicios.find((sub: any) => sub.nombre === servicio.nombre);
            if (encontrado) {
              subservicio = servicio.nombre;
            }
          }
        }
        this.serviciosRelacionadosSeleccionados[principal].push({
          nombre: servicio.nombre || '',
          subservicio: subservicio,
          fecha: servicio.fecha || '',
          nota: servicio.nota || '',
          estado: servicio.estado || 'pendiente',
          fecha_modificacion: servicio.fecha_modificacion || '',
          servicio_principal: principal
        });
      }
    }
  }

  convertirFechaLocal(fecha: string | Date): string | null {
  if (!fecha) return null;
  if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
  const date = new Date(fecha);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().split('T')[0];
}


  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  async mostrarError(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: '❌ ' + mensaje,
      duration: 2000,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
  }

  async guardarCambios() {
    const eta = new Date(this.embarcacion.eta);
    const etb = new Date(this.embarcacion.etb);
    const etd = new Date(this.embarcacion.etd);

    if (etb < eta || etd < eta || etd < etb) {
      await this.mostrarError('⚠️ Verifica el orden de las fechas ETA, ETB y ETD');
      return;
    }

    // --- CORRECCIÓN: asegurar subservicio antes de enviar ---
    for (const principal of Object.keys(this.serviciosRelacionadosSeleccionados)) {
      const estructura = this.serviciosEstructurados.find(s => s.principal === principal);
      if (!estructura) continue;
      for (const servicio of this.serviciosRelacionadosSeleccionados[principal]) {
        if (!servicio.subservicio) {
          const encontrado = estructura.subservicios.find((sub: any) => sub.nombre === servicio.nombre);
          if (encontrado) {
            servicio.subservicio = servicio.nombre;
          }
        }
      }
    }
    // --- FIN CORRECCIÓN ---

    const serviciosLimpios = Object.entries(this.serviciosRelacionadosSeleccionados)
      .map(([principal, servicios]: [string, any[]]) =>
        servicios.map((s: any) => ({
          nombre: s.nombre,
          subservicio: s.subservicio || '',
          nota: s.nota || '',
          estado: s.estado,
          servicio_principal: s.servicio_principal || principal,
          fecha: s.fecha || new Date().toISOString(),
          fecha_modificacion: s.fecha_modificacion || new Date().toISOString()
        }))
      )
      .reduce((acc, val) => acc.concat(val), []);

    // LOG para depuración
    console.log('🚀 Servicios relacionados enviados al backend:', serviciosLimpios);

    // Preparar datos para updateEmbarcacion (registra historial)
    const embarcacionActualizada = {
      ...this.embarcacion,
      servicios_relacionados: serviciosLimpios,
      estado_actual: this.embarcacion.estado,
      comentario_general: this.embarcacion.comentario || ''
    };

    if (this.embarcacion.eta) embarcacionActualizada.fecha_arribo = new Date(this.embarcacion.eta + 'T00:00:00');
    if (this.embarcacion.etb) embarcacionActualizada.fecha_estimada_zarpe = new Date(this.embarcacion.etb + 'T00:00:00');
    if (this.embarcacion.etd) embarcacionActualizada.fecha_zarpe = new Date(this.embarcacion.etd + 'T00:00:00');

    console.log('🚀 Enviando datos al backend con historial:', {
      embarcacionId: this.embarcacion._id,
      data: embarcacionActualizada
    });

    // Usar updateEmbarcacion para registrar en historial de cambios
    this.embarcacionesService.updateEmbarcacion(this.embarcacion._id, embarcacionActualizada).subscribe({
      next: async (response) => {
        console.log('✅ Respuesta exitosa del backend:', response);
        const toast = await this.toastCtrl.create({
          message: '✅ Cambios guardados correctamente y registrados en historial',
          duration: 2000,
          color: 'success',
          position: 'bottom'
        });
        await toast.present();
        this.modalCtrl.dismiss(true);
      },
      error: async (error) => {
        console.error('❌ Error del backend:', error);
        console.error('❌ Status:', error.status);
        console.error('❌ Mensaje:', error.error?.message || error.message);
        
        let errorMessage = '❌ Error al guardar los cambios';
        if (error.status === 404) {
          errorMessage = '❌ Embarcación no encontrada';
        } else if (error.status === 401) {
          errorMessage = '❌ No autorizado - verifica tu sesión';
        } else if (error.status === 500) {
          errorMessage = '❌ Error del servidor';
        }
        
        const toast = await this.toastCtrl.create({
          message: errorMessage,
          duration: 3000,
          color: 'danger',
          position: 'bottom'
        });
        await toast.present();
      }
    });
  }

  async abrirModalServicioPrincipal() {
    const modal = await this.modalCtrl.create({
      component: ModalServicioPrincipalComponent,
      componentProps: { servicios: this.serviciosEstructurados }
    });

    await modal.present();
    const { data: servicioSeleccionado } = await modal.onDidDismiss();
    if (!servicioSeleccionado) return;

    const estructura = this.serviciosEstructurados.find(s => s.principal === servicioSeleccionado);
    const subservicios = estructura?.subservicios || [];

    const modalSub = await this.modalCtrl.create({
      component: ModalSubservicioComponent,
      componentProps: { subservicios }
    });

    await modalSub.present();
    const { data } = await modalSub.onDidDismiss();
    if (!data?.campo || !data?.subservicio) return;

    const campo = data.campo;
    const subservicio = data.subservicio;

    if (!this.serviciosRelacionadosSeleccionados[servicioSeleccionado]) {
      this.serviciosRelacionadosSeleccionados[servicioSeleccionado] = [];
    }

    this.serviciosRelacionadosSeleccionados[servicioSeleccionado].push({
      nombre: campo, // el campo/campo del subservicio
      subservicio: subservicio, // el subservicio seleccionado
      fecha: '',
      nota: '',
      estado: 'pendiente',
      fecha_modificacion: new Date().toISOString(),
      servicio_principal: servicioSeleccionado
    });
    console.log('✅ Agregado:', this.serviciosRelacionadosSeleccionados[servicioSeleccionado]);
    console.log('🧩 servicioSeleccionado:', servicioSeleccionado);
  }

  eliminarServicioRelacionado(index: number, principal: string) {
    this.serviciosRelacionadosSeleccionados[principal].splice(index, 1);
  }

  async editarServicio(servicio: any, index: number, principal: string) {
    const modal = await this.modalCtrl.create({
      component: EditarServicioModalComponent,
      componentProps: {
        nota: servicio.nota,
        fecha: servicio.fecha,
        estado: servicio.estado
      }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      const s = this.serviciosRelacionadosSeleccionados[principal][index];
      s.nota = data.nota;
      s.fecha = data.fecha;
      s.estado = data.estado;
      s.fecha_modificacion = new Date().toISOString();
    }
  }

  getColorEstado(estado: string): string {
    switch (estado) {
      case 'completado': return 'success';
      case 'en_proceso': return 'warning';
      case 'pendiente': return 'danger';
      default: return 'medium';
    }
  }

  obtenerClavesServicios(): string[] {
    return Object.keys(this.serviciosRelacionadosSeleccionados);
  }

  async confirmarEliminar() {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar embarcación?',
      message: 'Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.eliminarEmbarcacion()
        }
      ]
    });

    await alert.present();
  }

  eliminarEmbarcacion() {
    this.embarcacionesService.deleteEmbarcacion(this.embarcacion._id).subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({
          message: '🗑️ Embarcación eliminada con éxito',
          duration: 2000,
          color: 'success',
          position: 'bottom'
        });
        await toast.present();
        this.modalCtrl.dismiss({ eliminada: true });
      },
      error: async () => {
        const toast = await this.toastCtrl.create({
          message: '❌ Error al eliminar embarcación',
          duration: 2000,
          color: 'danger',
          position: 'bottom'
        });
        await toast.present();
      }
    });
  }

  // metodo para reorder no se quede pegado y se posicione uno abajo del otro segun lo quiera el cliente
  reorderServicios(event: CustomEvent, principal: string) {
    const fromIndex = event.detail.from;
    const toIndex = event.detail.to;

    const list = this.serviciosRelacionadosSeleccionados[principal];

    // Reordenar array
    const movedItem = list.splice(fromIndex, 1)[0];
    list.splice(toIndex, 0, movedItem);

    event.detail.complete();
  }

  async agregarServicioDesdeGrupo(principal: string) {
    const estructuraGrupo = this.serviciosEstructurados.find(s => s.principal === principal);

    if (!estructuraGrupo) {
      this.mostrarError('No se encontró la estructura para el grupo: ' + principal);
      return;
    }

    const modalSub = await this.modalCtrl.create({
      component: ModalSubservicioComponent,
      componentProps: {
        subservicios: estructuraGrupo.subservicios
      }
    });

    await modalSub.present();
    const { data } = await modalSub.onDidDismiss();

    if (!data?.campo || !data?.subservicio) return;

    const campo = data.campo;
    const subservicio = data.subservicio;

    if (!this.serviciosRelacionadosSeleccionados[principal]) {
      this.serviciosRelacionadosSeleccionados[principal] = [];
    }

    this.serviciosRelacionadosSeleccionados[principal].push({
      nombre: campo, // el campo/campo del subservicio
      subservicio: subservicio, // el subservicio seleccionado
      fecha: '',
      nota: '',
      estado: 'pendiente',
      fecha_modificacion: new Date().toISOString(),
      servicio_principal: principal
    });
  }

  // Devuelve el país según el puerto
  getPaisFromPuerto(puerto: string): string {
    if (!puerto) return '';
    const puertoPaisMap: { [key: string]: string } = {
      'ANTOFAGASTA': 'Chile', 'IQUIQUE': 'Chile', 'VALPARAISO': 'Chile', 'SAN ANTONIO': 'Chile', 'TALCAHUANO': 'Chile', 'ARICA': 'Chile', 'COQUIMBO': 'Chile', 'PUERTO MONTT': 'Chile', 'PUNTA ARENAS': 'Chile', 'MEJILLONES': 'Chile', 'LIRQUEN': 'Chile', 'CORONEL': 'Chile', 'SAN VICENTE': 'Chile', 'TOCOPILLA': 'Chile', 'HUASCO': 'Chile', 'BUENOS AIRES': 'Argentina', 'ROSARIO': 'Argentina', 'LA PLATA': 'Argentina', 'MAR DEL PLATA': 'Argentina', 'PUERTO MADRYN': 'Argentina', 'USHUAIA': 'Argentina', 'MONTEVIDEO': 'Uruguay', 'NUEVA PALMIRA': 'Uruguay', 'COLONIA': 'Uruguay', 'SANTOS': 'Brasil', 'RIO DE JANEIRO': 'Brasil', 'PARANAGUA': 'Brasil', 'ITAJAI': 'Brasil', 'PORTO ALEGRE': 'Brasil', 'CALLAO': 'Perú', 'PAITA': 'Perú', 'CHIMBOTE': 'Perú', 'SALAVERRY': 'Perú', 'BARRANQUILLA': 'Colombia', 'CARTAGENA': 'Colombia', 'BUENAVENTURA': 'Colombia', 'SANTA MARTA': 'Colombia', 'GUAYAQUIL': 'Ecuador', 'MANTA': 'Ecuador', 'ESMERALDAS': 'Ecuador', 'COLON': 'Panamá', 'BALBOA': 'Panamá', 'VERACRUZ': 'México', 'MANZANILLO': 'México', 'LAZARO CARDENAS': 'México', 'ALTAMIRA': 'México', 'TAMPICO': 'México', 'LOS ANGELES': 'Estados Unidos', 'LONG BEACH': 'Estados Unidos', 'MIAMI': 'Estados Unidos', 'NEW YORK': 'Estados Unidos', 'HOUSTON': 'Estados Unidos', 'NEW ORLEANS': 'Estados Unidos', 'VANCOUVER': 'Canadá', 'MONTREAL': 'Canadá', 'QUEBEC': 'Canadá'
    };
    return puertoPaisMap[puerto.trim().toUpperCase()] || '';
  }

  // Devuelve el código de bandera según el país
  getFlagCodeFromPais(pais: string): string {
    if (!pais) return '';
    const map: { [key: string]: string } = {
      'Chile': 'cl', 'Argentina': 'ar', 'Uruguay': 'uy', 'Brasil': 'br', 'Perú': 'pe', 'Colombia': 'co', 'Ecuador': 'ec', 'Panamá': 'pa', 'México': 'mx', 'Estados Unidos': 'us', 'Canadá': 'ca'
    };
    return map[pais] || '';
  }
}
