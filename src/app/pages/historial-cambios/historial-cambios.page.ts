import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonButton,
  IonIcon,
  IonList,
  IonBadge,
  IonChip,
  IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonFooter,
  IonAlert,
  ToastController,
  LoadingController,
  InfiniteScrollCustomEvent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  timeOutline,
  personOutline,
  documentTextOutline,
  createOutline,
  trashOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  filterOutline,
  refreshOutline,
  boatOutline,
  homeOutline,
  chatbubblesOutline,
  logOutOutline
} from 'ionicons/icons';
import { HistorialCambiosService } from '../../services/historial-cambios.service';
import { AuthService } from '../../services/auth.service';
import { EmbarcacionesService } from '../../services/embarcaciones.service';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import {
  HistorialCambio,
  HistorialCambioDetallado,
  FiltrosHistorial
} from '../../models/historial-cambios';

@Component({
  selector: 'app-historial-cambios',
  templateUrl: './historial-cambios.page.html',
  styleUrls: ['./historial-cambios.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonButton,
    IonIcon,
    IonList,
    IonBadge,
    IonChip,
    IonSpinner,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonFooter,
    IonAlert,
    TranslatePipe
  ]
})
export class HistorialCambiosPage implements OnInit {
  historialCambios: HistorialCambioDetallado[] = [];
  embarcacionesCache: { [key: string]: any } = {};
  todasLasEmbarcaciones: any[] = [];
  embarcacionesMap: Map<string, any> = new Map(); // Cache de datos de embarcaciones
  filtros: FiltrosHistorial = {
    page: 1,
    limit: 20
  };
  
  isLoading = false;
  hasMoreData = true;
  showFilters = false;
  segmentoActivo = 'todos';
  showLogoutAlert = false;
  
  // Opciones para filtros
  tiposEntidad = [
    { value: 'embarcacion', label: 'Embarcaciones' }
  ];
  
  tiposAccion = [
    { value: '', label: 'Todas las acciones' },
    { value: 'crear', label: 'Crear' },
    { value: 'editar', label: 'Editar' },
    { value: 'eliminar', label: 'Eliminar' },
    { value: 'activar', label: 'Activar' },
    { value: 'desactivar', label: 'Desactivar' }
  ];

  constructor(
    private historialService: HistorialCambiosService,
    private authService: AuthService,
    private embarcacionesService: EmbarcacionesService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public translationService: TranslationService
  ) {
    addIcons({
      timeOutline,
      personOutline,
      documentTextOutline,
      createOutline,
      trashOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      filterOutline,
      refreshOutline,
      boatOutline,
      homeOutline,
      chatbubblesOutline,
      logOutOutline
    });
  }

  ngOnInit() {
    // Filtrar automáticamente solo embarcaciones
    this.filtros.entidad_tipo = 'embarcacion';
    this.cargarHistorial();
  }

  async cargarHistorial(reset: boolean = false) {
    if (reset) {
      this.filtros.page = 1;
      this.historialCambios = [];
      this.hasMoreData = true;
    }

    if (this.isLoading || !this.hasMoreData) {
      return;
    }

    this.isLoading = true;
    console.log('Cargando historial con filtros:', this.filtros);

    try {
      // Cargar todas las embarcaciones primero si no están cargadas
      if (this.embarcacionesMap.size === 0) {
        await this.cargarTodasLasEmbarcaciones();
      }
      
      const response = await this.historialService.obtenerHistorial(this.filtros).toPromise();
      console.log('Respuesta del servidor:', response);
      
      if (response) {
        // Verificar si la respuesta tiene la estructura esperada
        const historial = response.historial || [];
        console.log('Historial obtenido:', historial);
        console.log('Número de registros:', historial.length);
        
        if (reset) {
          this.historialCambios = historial;
        } else {
          this.historialCambios.push(...historial);
        }
        
        console.log('Historial final en componente:', this.historialCambios);
        
        this.hasMoreData = historial.length === this.filtros.limit;
        this.filtros.page = (this.filtros.page || 1) + 1;
        
        // Cargar datos de embarcaciones después de obtener el historial
        await this.cargarDatosEmbarcaciones();
      } else {
        console.log('No se recibió respuesta del servidor');
        // Si no hay respuesta, inicializar como array vacío
        if (reset) {
          this.historialCambios = [];
        }
        this.hasMoreData = false;
      }
    } catch (error) {
      console.error('Error al cargar historial:', error);
      // Inicializar como array vacío en caso de error
      if (reset) {
        this.historialCambios = [];
      }
      this.hasMoreData = false;
      this.presentToast('Error al cargar el historial de cambios. Verifique que el servidor esté funcionando.', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  onSegmentChange(event: any) {
    this.segmentoActivo = event.detail.value;
    
    switch (this.segmentoActivo) {
      case 'embarcaciones':
        this.filtros.entidad_tipo = 'embarcacion';
        break;
      case 'usuarios':
        this.filtros.entidad_tipo = 'usuario';
        break;
      case 'todos':
      default:
        this.filtros.entidad_tipo = undefined;
        break;
    }
    
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.cargarHistorial(true);
  }

  limpiarFiltros() {
    this.filtros = {
      page: 1,
      limit: 20
    };
    this.segmentoActivo = 'todos';
    this.cargarHistorial(true);
  }

  toggleFiltros() {
    this.showFilters = !this.showFilters;
  }

  async refrescar() {
    const loading = await this.loadingController.create({
      message: 'Actualizando historial...'
    });
    await loading.present();
    
    await this.cargarHistorial(true);
    await loading.dismiss();
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.cargarHistorial().then(() => {
      event.target.complete();
    });
  }

  getIconoAccion(accion: string): string {
    switch (accion) {
      case 'crear': return 'checkmark-circle-outline';
      case 'editar': return 'create-outline';
      case 'eliminar': return 'trash-outline';
      case 'activar': return 'checkmark-circle-outline';
      case 'desactivar': return 'close-circle-outline';
      default: return 'document-text-outline';
    }
  }

  getColorAccion(accion: string): string {
    switch (accion) {
      case 'crear': return 'success';
      case 'editar': return 'warning';
      case 'eliminar': return 'danger';
      case 'activar': return 'success';
      case 'desactivar': return 'medium';
      default: return 'primary';
    }
  }

  getColorEntidad(entidad: string): string {
    switch (entidad) {
      case 'embarcacion': return 'primary';
      case 'usuario': return 'secondary';
      case 'cliente': return 'tertiary';
      case 'servicio': return 'success';
      default: return 'medium';
    }
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatearCampo(campo: string): string {
    // Convertir snake_case a formato legible
    return campo
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  trackByCambio(index: number, cambio: HistorialCambioDetallado): string {
    return cambio._id;
  }

  // Método eliminado - ya no es necesario con el nuevo enfoque

  async cargarTodasLasEmbarcaciones() {
    try {
      const response = await this.embarcacionesService.obtenerReporteTodas().toPromise();
      if (response && response.data) {
        this.todasLasEmbarcaciones = response.data;
        // Crear mapa para búsquedas rápidas
        this.embarcacionesMap.clear();
        this.todasLasEmbarcaciones.forEach(embarcacion => {
          if (embarcacion._id) {
            this.embarcacionesMap.set(embarcacion._id, embarcacion);
          }
        });
        console.log(`Cargadas ${this.todasLasEmbarcaciones.length} embarcaciones en el mapa`);
      }
    } catch (error) {
      console.error('Error al cargar todas las embarcaciones:', error);
    }
  }

  // Método para cargar datos de todas las embarcaciones del historial
  async cargarDatosEmbarcaciones() {
    // Ya no necesitamos cargar individualmente, usamos el mapa
    this.cdr.detectChanges();
  }

  // Método para obtener información de la embarcación para mostrar
  getEmbarcacionInfo(embarcacionId: string): string {
    // Buscar en el mapa de embarcaciones
    const embarcacion = this.embarcacionesMap.get(embarcacionId);
    
    if (embarcacion) {
      // Priorizar da_numero si existe y no está vacío
      if (embarcacion.da_numero && embarcacion.da_numero.trim() !== '') {
        return embarcacion.da_numero;
      }
      // Si no hay da_numero, usar nombre si existe y no está vacío
      if (embarcacion.nombre && embarcacion.nombre.trim() !== '') {
        return embarcacion.nombre;
      }
    }
    
    // Si no se encuentra en el mapa, mostrar los últimos 8 caracteres del ID
    return embarcacionId.length > 8 ? '...' + embarcacionId.slice(-8) : embarcacionId;
  }

  get alertButtons() {
    return [
      { text: this.translationService.getTranslation('cancel'), role: 'cancel', cssClass: 'alert-cancel-marino' },
      { text: this.translationService.getTranslation('continue'), role: 'confirm', cssClass: 'alert-confirm-marino' }
    ];
  }

  confirmLogout() {
    this.showLogoutAlert = true;
  }

  handleLogoutConfirm(ev: any) {
    if (ev.detail.role === 'confirm') {
      this.authService.logout().subscribe(() => {
        this.router.navigate(['/login']);
      });
    }
    this.showLogoutAlert = false;
  }
}