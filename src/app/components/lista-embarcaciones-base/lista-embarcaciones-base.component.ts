import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmbarcacionesService } from 'src/app/services/embarcaciones.service';
import { FooterNavegacionComponent } from '../footer-navegacion/footer-navegacion.component';
import { ModalActualizarEmbarcacionComponent } from 'src/app/modals/modal-actualizar-embarcacion/modal-actualizar-embarcacion.component';
import {
  IonList, IonItem, IonLabel, IonButton, IonIcon, IonModal, IonTextarea, IonSelectOption,
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonSelect, IonFooter, IonCol,
  IonRow, IonGrid, IonText, IonDatetime, IonDatetimeButton, IonBadge, IonNote,
  IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonAccordionGroup, IonAccordion, IonInput
} from '@ionic/angular/standalone';
import { ModalController, PopoverController, AlertController, ToastController } from '@ionic/angular';
import { IEmbarcacion } from 'src/app/models/embarcacion';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-lista-embarcaciones-base',
  templateUrl: './lista-embarcaciones-base.component.html',
  styleUrls: ['./lista-embarcaciones-base.component.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonList, IonItem, IonLabel, IonButton, IonIcon, IonModal, IonTextarea, IonSelectOption,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonSelect, IonFooter, IonCol,
    IonRow, IonGrid, IonText, IonDatetime, IonDatetimeButton, IonInput, IonBadge, IonNote,
    IonCardContent, IonCardTitle, IonCardHeader, IonCard, FooterNavegacionComponent,
    IonAccordionGroup, IonAccordion
  ],
  providers: [PopoverController, ModalController, AlertController, ToastController]
})
export class ListaEmbarcacionesBaseComponent implements OnInit {
  private _properties: IEmbarcacion[] = [];
  
  @Input() 
  set properties(value: IEmbarcacion[]) {
    this._properties = value;
    this.actualizarContadores();
  }
  
  get properties(): IEmbarcacion[] {
    return this._properties;
  }
  
  @Input() RolUsuario: string = '';
  @Input() link: string = '';
  @Input() total: number = 0;
  @Input() page: number = 1;
  @Input() limit: number = 1;
  @Input() totalPags: number = 0;

  @Output() pageChange = new EventEmitter<number>();
  @Output() embarcacionDeleted = new EventEmitter<string>();

  modalAbierto = false;
  selectedEmbarcacion: any = null;
  esAdmin: boolean = false;
  puedeEditarFechas: boolean = true;

  servicioPrincipalSeleccionado: string = '';
  subServicios: { nombre: string; servicios?: { nombre: string }[] }[] = [];
  subServicioSeleccionado: string = '';
  serviciosDelSubservicio: { nombre: string }[] = [];
  serviciosEstructurados: any[] = [];

  serviciosRelacionadosSeleccionados: {
    [principal: string]: {
      nombre: string;
      subservicio?: string;
      fecha: string;
      nota: string;
      estado: string;
      fecha_modificacion?: string;
      servicio_principal: string;
    }[];
  } = {};

  mostrarServiciosPrincipales = false;
  mostrarSubservicios = false;
  servicioRelacionadoSeleccionado: string = '';
  fechaServicioRelacionado: string = '';
  notaServicioRelacionado: string = '';
  filtroServicioRelacionado: string = '';

  // Variables para contadores de resumen
  public totalAprobadas: number = 0;
  public totalEnProceso: number = 0;
  public totalObservaciones: number = 0;

  // Diccionario de puertos a países de América (copiado de detalle-nave-panel-cliente.page.ts)
  private PUERTOS_PAISES: { [key: string]: string } = {
    // Chile
    'ANTOFAGASTA': 'Chile',
    'IQUIQUE': 'Chile',
    'VALPARAISO': 'Chile',
    'SAN ANTONIO': 'Chile',
    'TALCAHUANO': 'Chile',
    'ARICA': 'Chile',
    'COQUIMBO': 'Chile',
    'PUERTO MONTT': 'Chile',
    'PUNTA ARENAS': 'Chile',
    'MEJILLONES': 'Chile',
    'LIRQUEN': 'Chile',
    'CORONEL': 'Chile',
    'SAN VICENTE': 'Chile',
    'TOCOPILLA': 'Chile',
    'HUASCO': 'Chile',
    // Argentina
    'BUENOS AIRES': 'Argentina',
    'ROSARIO': 'Argentina',
    'LA PLATA': 'Argentina',
    'MAR DEL PLATA': 'Argentina',
    'PUERTO MADRYN': 'Argentina',
    'USHUAIA': 'Argentina',
    // Uruguay
    'MONTEVIDEO': 'Uruguay',
    'NUEVA PALMIRA': 'Uruguay',
    'COLONIA': 'Uruguay',
    // Brasil
    'SANTOS': 'Brasil',
    'RIO DE JANEIRO': 'Brasil',
    'PARANAGUA': 'Brasil',
    'ITAJAI': 'Brasil',
    'PORTO ALEGRE': 'Brasil',
    // Perú
    'CALLAO': 'Perú',
    'PAITA': 'Perú',
    'CHIMBOTE': 'Perú',
    'SALAVERRY': 'Perú',
    // Colombia
    'BARRANQUILLA': 'Colombia',
    'CARTAGENA': 'Colombia',
    'BUENAVENTURA': 'Colombia',
    'SANTA MARTA': 'Colombia',
    // Ecuador
    'GUAYAQUIL': 'Ecuador',
    'MANTA': 'Ecuador',
    'ESMERALDAS': 'Ecuador',
    // Panamá
    'COLON': 'Panamá',
    'BALBOA': 'Panamá',
    // México
    'VERACRUZ': 'México',
    'MANZANILLO': 'México',
    'LAZARO CARDENAS': 'México',
    'ALTAMIRA': 'México',
    'TAMPICO': 'México',
    // Estados Unidos
    'LOS ANGELES': 'Estados Unidos',
    'LONG BEACH': 'Estados Unidos',
    'MIAMI': 'Estados Unidos',
    'NEW YORK': 'Estados Unidos',
    'HOUSTON': 'Estados Unidos',
    'NEW ORLEANS': 'Estados Unidos',
    // Canadá
    'VANCOUVER': 'Canadá',
    'MONTREAL': 'Canadá',
    'QUEBEC': 'Canadá',
  };

  constructor(
    private router: Router,
    private popoverController: PopoverController,
    private alertController: AlertController,
    private toastController: ToastController,
    private embarcacionesService: EmbarcacionesService,
    private modalController: ModalController,
    private authService: AuthService   // ✅ agrégalo aquí
  ) {}

  ngOnInit() {
  if (!this.RolUsuario) {
    const tokenData = this.authService.getDecodedToken();
    this.RolUsuario = tokenData?.role ?? '';
    console.log('✅ Rol recuperado en hijo (fallback):', this.RolUsuario);
  } else {
    console.log('✅ Rol recibido por Input en hijo:', this.RolUsuario);
  }

  this.esAdmin = ['ADMINISTRADOR', ].includes(this.RolUsuario?.toUpperCase());
  this.obtenerServiciosEstructurados();
  // solo admin puede editar las fechas, pero trabajadores pueden ver
  this.puedeEditarFechas = this.esAdmin;
  
  // Actualizar contadores iniciales
  this.actualizarContadores();
}



  async abrirModal(embarcacion: any) {
  console.log('📝 ROL EN abrirModal:', this.RolUsuario);

  let response: any;

  try {
    // ✅ Ahora todos (incluso CLIENTE) usan la misma ruta:
    response = await this.embarcacionesService
      .getEmbarcacionById(embarcacion._id)
      .toPromise();

    console.log('✅ Llamada a getEmbarcacionById OK:', response);

    const embarcacionCompleta: any = response?.data || {};

    // Asegurar que servicios_relacionados sea array
    if (!Array.isArray(embarcacionCompleta.servicios_relacionados)) {
      embarcacionCompleta.servicios_relacionados = [];
    }

    const modal = await this.modalController.create({
      component: ModalActualizarEmbarcacionComponent,
      componentProps: {
        embarcacion: embarcacionCompleta,
        esAdmin: this.esAdmin,
        puedeEditarFechas: this.puedeEditarFechas,
        servicioPrincipalSeleccionado: this.servicioPrincipalSeleccionado,
        serviciosEstructurados: this.serviciosEstructurados
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data === true) {
      this.obtenerServiciosEstructurados();
    }

    if (data?.eliminada) {
      this.properties = this.properties.filter(e => e._id !== embarcacion._id);
    }
  } catch (error) {
    console.error('❌ Error al abrir el modal:', error);
    await this.mostrarError('No se pudo cargar la embarcación.');
  }
}







  cargarSubtituloYSubservicios() {
    const servicioSeleccionado = this.serviciosEstructurados.find(s => s.principal === this.servicioPrincipalSeleccionado);
    this.subServicios = servicioSeleccionado?.subservicios || [];
    this.subServicioSeleccionado = '';
    this.serviciosDelSubservicio = [];
  }

  cargarServiciosDelSubservicio() {
    const sub = this.subServicios.find(s => s.nombre === this.subServicioSeleccionado);
    this.serviciosDelSubservicio = sub?.servicios || [];
  }

  anadirServicioRelacionado() {
  let nombre = this.servicioRelacionadoSeleccionado?.trim();
  const fecha = this.fechaServicioRelacionado;
  const nota = this.notaServicioRelacionado?.trim();
  const estado = 'pendiente';
  const principal = this.servicioPrincipalSeleccionado;
  const subservicio = this.subServicioSeleccionado;

  if (!nombre && subservicio) {
    nombre = subservicio; // si el subservicio no tiene servicios internos
  }

  if (!nombre || !principal) return;

  if (!this.serviciosRelacionadosSeleccionados[principal]) {
    this.serviciosRelacionadosSeleccionados[principal] = [];
  }

  this.serviciosRelacionadosSeleccionados[principal].push({
    nombre,
    subservicio,
    fecha,
    nota,
    estado,
    fecha_modificacion: new Date().toISOString(),
    servicio_principal: principal
  });

  // limpiar campos
  this.servicioRelacionadoSeleccionado = '';
  this.fechaServicioRelacionado = '';
  this.notaServicioRelacionado = '';
  this.subServicioSeleccionado = '';
}


  async validarFechas(): Promise<boolean> {
    const eta = new Date(this.selectedEmbarcacion.eta);
    const etb = new Date(this.selectedEmbarcacion.etb);
    const etd = new Date(this.selectedEmbarcacion.etd);

    if (etb < eta) return await this.mostrarError('ETB no puede ser anterior a ETA');
    if (etd < eta) return await this.mostrarError('ETD no puede ser anterior a ETA');
    if (etd < etb) return await this.mostrarError('ETD no puede ser anterior a ETB');

    return true;
  }

  private async mostrarError(msg: string): Promise<boolean> {
    const toast = await this.toastController.create({
      message: `❌ ${msg}`,
      duration: 2000,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
    return false;
  }

  convertirFechaLocal(fecha: string | Date): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split('T')[0];
  }

  seleccionarServicioPrincipal(servicio: string) {
    this.servicioPrincipalSeleccionado = servicio;
    this.mostrarServiciosPrincipales = false;
    this.cargarSubtituloYSubservicios();
  }

  seleccionarSubservicio(nombre: string) {
    this.subServicioSeleccionado = nombre;
    this.mostrarSubservicios = false;
    this.cargarServiciosDelSubservicio();
  }

  get serviciosRelacionadosFiltrados() {
    const filtro = this.filtroServicioRelacionado.toLowerCase().trim();
    return this.serviciosDelSubservicio.filter(s => s.nombre.toLowerCase().includes(filtro));
  }

  getEstadoIcono(nombre: string | undefined): string {
    switch (nombre?.toLowerCase()) {
      case 'aprobado': return 'checkmark-circle-outline';
      case 'observaciones': return 'close-circle-outline';
      case 'en_proceso': return 'alert-circle-outline';
      default: return 'help-circle-outline';
    }
  }
  puedeAbrirModal(): boolean {
  if (!this.RolUsuario) return true; 
  return ['ADMINISTRADOR', 'TRABAJADOR', 'CLIENTE'].includes(
    this.RolUsuario?.toUpperCase() || ''
  );
}

  puedeEliminarEmbarcacion(): boolean {
    if (!this.RolUsuario) return false;
    return this.RolUsuario?.toUpperCase() === 'ADMINISTRADOR';
  }

  puedeCrearEmbarcacion(): boolean {
    if (!this.RolUsuario) return false;
    return this.RolUsuario?.toUpperCase() === 'ADMINISTRADOR';
  }





  obtenerServiciosEstructurados() {
    this.embarcacionesService.getServiciosEstructurados().subscribe({
      next: (data) => this.serviciosEstructurados = data || [],
      error: (err) => console.error('Error cargando estructura de servicios:', err)
    });
  }

  actualizarFechaModificacion(index: number) {
    const claves = Object.keys(this.serviciosRelacionadosSeleccionados);
    for (const principal of claves) {
      if (this.serviciosRelacionadosSeleccionados[principal][index]) {
        this.serviciosRelacionadosSeleccionados[principal][index].fecha_modificacion = new Date().toISOString();
      }
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

  formatearFecha(fecha: any): string | undefined {
    if (!fecha) return undefined;
    if (typeof fecha === 'string' && fecha.includes('T')) return fecha;
    if (typeof fecha === 'string') return `${fecha}T00:00:00.000Z`;
    if (fecha instanceof Date) return fecha.toISOString();
    return undefined;
  }

  verDetalle(embarc: any) {
    // Aquí puedes abrir un modal o navegar a la vista de detalle
    console.log('Ver detalle', embarc);
  }

  editarEmbarcacion(embarc: any) {
    // Aquí puedes abrir el formulario de edición
    console.log('Editar embarcación', embarc);
  }

  async confirmarEliminar(embarc: any) {
    const alert = await this.alertController.create({
      header: '¿Eliminar embarcación?',
      message: `¿Estás seguro que deseas eliminar la embarcación "${embarc.titulo_embarcacion}"? Esta acción no se puede deshacer.`,
      buttons: [
        { 
          text: 'Cancelar', 
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          cssClass: 'alert-button-delete',
          handler: () => this.eliminarEmbarcacion(embarc)
        }
      ]
    });

    await alert.present();
  }

  eliminarEmbarcacion(embarc: any) {
    this.embarcacionesService.deleteEmbarcacion(embarc._id).subscribe({
      next: async () => {
        // Eliminar de la lista local
        this.properties = this.properties.filter(e => e._id !== embarc._id);
        
        // Actualizar contadores
        this.actualizarContadores();
        
        // Emitir evento para actualizar la vista padre
        this.embarcacionDeleted.emit(embarc._id);
        
        // Mostrar mensaje de éxito
        const toast = await this.toastController.create({
          message: '🗑️ Embarcación eliminada con éxito',
          duration: 3000,
          color: 'success',
          position: 'bottom'
        });
        await toast.present();
      },
      error: async (error) => {
        console.error('Error al eliminar embarcación:', error);
        
        // Mostrar mensaje de error
        const toast = await this.toastController.create({
          message: '❌ Error al eliminar embarcación',
          duration: 3000,
          color: 'danger',
          position: 'bottom'
        });
        await toast.present();
      }
    });
  }

  // Devuelve el país del cliente si existe, o null si no
  getPaisCliente(embarc: any): string | null {
    if (
      embarc?.clientes &&
      embarc.clientes[0]?.cliente_id &&
      'pais_cliente' in embarc.clientes[0].cliente_id &&
      embarc.clientes[0].cliente_id.pais_cliente
    ) {
      return embarc.clientes[0].cliente_id.pais_cliente;
    }
    return null;
  }

  // Devuelve el país según el puerto, o null si no está en el diccionario
  getPaisPorPuerto(puerto: string): string | null {
    if (!puerto) return null;
    const key = puerto.trim().toUpperCase();
    return this.PUERTOS_PAISES[key] || null;
  }

  // Obtiene el código de bandera según el país
  getFlagCodeFromPais(pais: string): string {
    if (!pais) return '';
    const map: { [key: string]: string } = {
      'Chile': 'cl',
      'Argentina': 'ar',
      'Uruguay': 'uy',
      'Brasil': 'br',
      'Perú': 'pe',
      'Colombia': 'co',
      'Ecuador': 'ec',
      'Panamá': 'pa',
      'México': 'mx',
      'Estados Unidos': 'us',
      'Canadá': 'ca'
    };
    return map[pais] || '';
  }

  // Getters para el resumen de contadores
  get totalEmbarcaciones(): number {
    return this.properties.length;
  }

  get cantidadAprobadas(): number {
    return this.properties.filter(e => e.estado_actual === 'aprobado').length;
  }

  get cantidadEnProceso(): number {
    return this.properties.filter(e => e.estado_actual === 'en_proceso').length;
  }

  get cantidadObservaciones(): number {
    return this.properties.filter(e => e.estado_actual === 'observaciones').length;
  }

  // Método para actualizar los contadores
  actualizarContadores() {
    this.totalAprobadas = this.cantidadAprobadas;
    this.totalEnProceso = this.cantidadEnProceso;
    this.totalObservaciones = this.cantidadObservaciones;
  }

  // Método para calcular porcentajes
  getPorcentaje(cantidad: number): number {
    if (this.totalEmbarcaciones === 0) return 0;
    return Math.round((cantidad / this.totalEmbarcaciones) * 100);
  }

  getFechaFormateada(fecha: string | Date | undefined): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
