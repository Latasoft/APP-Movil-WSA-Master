import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmbarcacionesService } from 'src/app/services/embarcaciones.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonSpinner,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  ModalController,
} from '@ionic/angular/standalone';
import { ModalDetalleSubserviciosComponent } from 'src/app/components/modal-detalle-subservicios/modal-detalle-subservicios.component';

@Component({
  selector: 'app-detalle-nave-panel-cliente',
  standalone: true,
  templateUrl: './detalle-nave-panel-cliente.page.html',
  styleUrls: ['./detalle-nave-panel-cliente.page.scss'],
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonSpinner,
    IonItem,
    IonLabel,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    ModalDetalleSubserviciosComponent,
  ],
})
export class DetalleNavePanelClientePage implements OnInit {
  id: string | null = null;
  embarcacion: any = null;
  loading = true;

  // Mapeo de puertos a países de América
  puertoPaisMap: { [key: string]: string } = {
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
    private route: ActivatedRoute,
    private embarcacionesService: EmbarcacionesService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      console.log('✅ id recibido en detalle:', this.id);
      console.log('🔍 Parámetros completos:', params);

      if (this.id) {
        this.cargarEmbarcacionRobusta(this.id);
      } else {
        console.error('❌ No se recibió id en los parámetros');
        this.loading = false;
      }
    });
  }

  cargarEmbarcacionRobusta(id: string) {
    this.loading = true;
    // 1. Intentar por DA
    this.embarcacionesService.getEmbarcacionByDaNumero(id).subscribe({
      next: (embarcacion) => {
        console.log('✅ [DA] Embarcación específica recibida:', embarcacion);
        if (embarcacion && embarcacion.data) {
          this.embarcacion = embarcacion.data;
          // Cargar servicios reales de la base de datos
          this.cargarServiciosReales(id);
          return;
        }
        if (embarcacion && Object.keys(embarcacion).length > 0) {
          this.embarcacion = embarcacion;
          // Cargar servicios reales de la base de datos
          this.cargarServiciosReales(id);
          return;
        }
        this.buscarPorId(id);
      },
      error: (error) => {
        console.warn('❌ [DA] Error al buscar por DA:', error);
        this.buscarPorId(id);
      }
    });
  }

  buscarPorId(id: string) {
    this.embarcacionesService.getEmbarcacionById(id).subscribe({
      next: (resp) => {
        console.log('✅ [_id] Respuesta recibida:', resp);
        if (resp && resp.data) {
          this.embarcacion = resp.data;
          // Cargar servicios reales de la base de datos
          this.cargarServiciosReales(id);
          return;
        }
        this.buscarEnArrayCompleto(id);
      },
      error: (error) => {
        console.warn('❌ [_id] Error al buscar por _id:', error);
        this.buscarEnArrayCompleto(id);
      }
    });
  }

  buscarEnArrayCompleto(id: string) {
    this.embarcacionesService.getEmbarcacionesReporteCompleto().subscribe({
      next: (embarcaciones) => {
        console.log('✅ [Array] Todas las embarcaciones recibidas:', embarcaciones);
        this.embarcacion = embarcaciones.find(
          (e: any) => e.da_numero === id || e._id === id
        );
        console.log('✅ [Array] Embarcación encontrada:', this.embarcacion);
        // Cargar servicios reales de la base de datos
        if (this.embarcacion) {
          this.cargarServiciosReales(id);
        } else {
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('❌ [Array] Error en búsqueda en array completo:', error);
        this.loading = false;
      }
    });
  }

  // Método para cargar servicios reales de la base de datos
  cargarServiciosReales(daNumero: string) {
    // Verificar si la embarcación ya tiene servicios_relacionados
    if (this.embarcacion && this.embarcacion.servicios_relacionados && this.embarcacion.servicios_relacionados.length > 0) {
      console.log('✅ Servicios relacionados encontrados en la embarcación:', this.embarcacion.servicios_relacionados);
      this.embarcacion.services = this.transformarServiciosRelacionados(this.embarcacion.servicios_relacionados);
      this.loading = false;
      return;
    }

    // Si no tiene servicios_relacionados, intentar obtenerlos del endpoint
    this.embarcacionesService.getServiciosRelacionados(daNumero).subscribe({
      next: (serviciosRelacionados) => {
        console.log('✅ Servicios relacionados recibidos del endpoint:', serviciosRelacionados);
        if (serviciosRelacionados && serviciosRelacionados.data) {
          this.embarcacion.services = this.transformarServiciosRelacionados(serviciosRelacionados.data);
        } else {
          // Si no hay servicios relacionados, intentar con servicios generales
          this.cargarServiciosGenerales(daNumero);
        }
        this.loading = false;
      },
      error: (error) => {
        console.warn('❌ Error al cargar servicios relacionados:', error);
        // Si falla, intentar con servicios generales
        this.cargarServiciosGenerales(daNumero);
      }
    });
  }

  // Método para cargar servicios generales
  cargarServiciosGenerales(daNumero: string) {
    this.embarcacionesService.getServiciosEmbarcacion(daNumero).subscribe({
      next: (servicios) => {
        if (servicios && servicios.data) {
          this.embarcacion.services = this.transformarServiciosGenerales(servicios.data);
        } else {
          // Si no hay servicios, dejar vacío
          this.embarcacion.services = [];
        }
        this.loading = false;
      },
      error: (error) => {
        // Si hay error, dejar vacío
        this.embarcacion.services = [];
        this.loading = false;
      }
    });
  }

  // Transformar servicios relacionados a formato esperado
  transformarServiciosRelacionados(serviciosRelacionados: any[]) {
    // Agrupar por servicio_principal (nombre del botón)
    const serviciosAgrupados: { [key: string]: any[] } = {};
    
    serviciosRelacionados.forEach(servicio => {
      const servicioPrincipal = servicio.servicio_principal || 'Servicio General';
      if (!serviciosAgrupados[servicioPrincipal]) {
        serviciosAgrupados[servicioPrincipal] = [];
      }
      
      serviciosAgrupados[servicioPrincipal].push({
        sub_service: servicio.nombre, // nombre del subservicio
        date: servicio.fecha_modificacion, // fecha de modificación
        estado: servicio.estado || 'pendiente',
        nota: servicio.nota || ''
      });
    });

    // Convertir a formato esperado
    return Object.keys(serviciosAgrupados).map(servicioPrincipal => ({
      main_service: servicioPrincipal, // nombre del botón
      sub_services: serviciosAgrupados[servicioPrincipal]
    }));
  }

  // Transformar servicios generales a formato esperado
  transformarServiciosGenerales(servicios: any[]) {
    return servicios.map(servicio => ({
      main_service: servicio.nombre_servicio || servicio.nombre,
      sub_services: servicio.estados ? servicio.estados.map((estado: any) => ({
        sub_service: estado.nombre_estado,
        date: new Date().toISOString().split('T')[0],
        estado: 'pendiente',
        nota: ''
      })) : []
    }));
  }

  // Método para obtener servicios de ejemplo (fallback)
  getServiciosEjemplo() {
    return [
      {
        main_service: "Crew Services",
        sub_services: [
          {
            sub_service: "Crew change coordination",
            date: "2025-07-08",
            estado: "pendiente",
            nota: "Esperando autorización de inmigración"
          },
          {
            sub_service: "Medical assistance",
            date: "2025-07-08",
            estado: "completado",
            nota: "Tripulante atendido en hospital local"
          },
          {
            sub_service: "Visa processing",
            date: "2025-07-08",
            estado: "en_progreso",
            nota: "Documentación en revisión"
          }
        ]
      },
      {
        main_service: "Maritime Support",
        sub_services: [
          {
            sub_service: "Technical Assistance",
            date: "2025-07-09",
            estado: "completado",
            nota: "Asistencia técnica completada"
          },
          {
            sub_service: "Port Coordination",
            date: "2025-07-09",
            estado: "en_progreso",
            nota: "Coordinando con autoridades portuarias"
          },
          {
            sub_service: "Safety inspections",
            date: "2025-07-09",
            estado: "pendiente",
            nota: "Programada para mañana"
          }
        ]
      },
      {
        main_service: "Last Mile",
        sub_services: [
          {
            sub_service: "Spare parts / stores on board delivery.",
            date: "2025-07-08",
            estado: "pendiente",
            nota: "Necesita autorización del capitán"
          },
          {
            sub_service: "Cargo handling.",
            date: "2025-07-08",
            estado: "en_progreso",
            nota: "En proceso de carga"
          },
          {
            sub_service: "Fordwarding Coordination",
            date: "2025-07-08",
            estado: "completado",
            nota: "Servicio completado exitosamente"
          },
          {
            sub_service: "Landing and Return Spare Parts.",
            date: "2025-07-08",
            estado: "pendiente",
            nota: ""
          }
        ]
      }
    ];
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return '-';
    return date.substring(0, 10);
  }

  async openModal(servicioPrincipal: string) {
    if (!this.embarcacion?.services) {
      console.error('❌ No hay services cargados en la embarcación.');
      return;
    }

    console.log('🟦 Buscando en services:', servicioPrincipal);

    const servicio = this.embarcacion.services.find(
      (s: any) =>
        (s.main_service || '').trim().toLowerCase() ===
        (servicioPrincipal || '').trim().toLowerCase()
    );

    if (!servicio) {
      console.error('❌ No se encontró el servicio:', servicioPrincipal);
      return;
    }

    const subservicios = servicio.sub_services.map((s: any) => ({
      nombre: s.sub_service,
      fecha_modificacion: s.date,
      estado: s.estado,
      nota: s.nota || '',      // ✅ AQUÍ se trae la nota
    }));

    console.log('✅ Subservicios para el modal:', subservicios);

    // 4. Abrir modal de subservicios (reutilizando el de detalle)
    const modalSub = await this.modalController.create({
      component: ModalDetalleSubserviciosComponent,
      componentProps: {
        mainServiceName: servicioPrincipal,
        subservices: subservicios
      }
    });
    await modalSub.present();
    const { data: subserviciosSeleccionados } = await modalSub.onWillDismiss();
    if (!subserviciosSeleccionados || subserviciosSeleccionados.length === 0) return;

    // 5. Agregar los subservicios seleccionados al acordeón correspondiente
    let servicioExistente = this.embarcacion.services.find((s: any) => s.main_service === servicioPrincipal);
    if (!servicioExistente) {
      // Si no existe el servicio principal, lo creamos
      this.embarcacion.services.push({
        main_service: servicioPrincipal,
        sub_services: [...subserviciosSeleccionados]
      });
    } else {
      // Si ya existe, agregamos solo los subservicios que no estén
      subserviciosSeleccionados.forEach((nuevo: any) => {
        if (!servicioExistente.sub_services.some((s: any) => s.nombre === nuevo.nombre)) {
          servicioExistente.sub_services.push(nuevo);
        }
      });
    }
  }

  getPaisFromPuerto(puerto: string): string {
    if (!puerto) return '-';
    return this.puertoPaisMap[puerto.toUpperCase()] || 'País no disponible';
  }
}
