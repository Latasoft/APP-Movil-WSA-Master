import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonSpinner,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonBadge
} from '@ionic/angular/standalone';

import { FormsModule } from '@angular/forms';
import { EmbarcacionesService } from 'src/app/services/embarcaciones.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { EmpresaService } from 'src/app/services/empresa.service';

@Component({
  selector: 'app-detalle-naves-cliente',
  standalone: true,
  templateUrl: './detalle-naves-cliente.page.html',
  styleUrls: ['./detalle-naves-cliente.page.scss'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonSpinner,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonBadge
  ]
})
export class DetalleNavesClientePage implements OnInit, OnDestroy {

  embarcaciones: any[] = [];
  loading = true;
  searchText: string = '';
  clienteUsername: string = '';

  // Variables de paginación
  currentPage: number = 1;
  itemsPerPage: number = 10; // Cambia este número para mostrar más o menos tarjetas
  totalPages: number = 1;

  // Filtros
  selectedCountry: string = '';
  selectedPort: string = '';
  selectedStatus: string = '';
  selectedOperador: string = '';

  countryOptions: string[] = [];
  portOptions: string[] = [];
  statusOptions: string[] = ['aprobado', 'en_proceso', 'observaciones'];
  operadorOptions: string[] = [];

  timers: { [daNumero: string]: number } = {};
  intervalId: any;
  private searchSubject = new Subject<string>();

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

  public totalAprobadas: number = 0;
  public totalEnProceso: number = 0;
  public totalObservaciones: number = 0;

  getPaisFromPuerto(puerto: string): string {
    if (!puerto) return '-';
    return this.puertoPaisMap[puerto.toUpperCase()] || 'País no disponible';
  }

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

  constructor(
    private embarcacionesService: EmbarcacionesService,
    private authService: AuthService,
    private usuariosService: UsuariosService,
    private cd: ChangeDetectorRef,
    private empresaService: EmpresaService
  ) {}

  ngOnInit(): void {
    // Configurar debounce para búsqueda
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchText => {
      this.searchText = searchText;
    });

    const clienteId = this.authService.getIdFromToken();
    if (!clienteId) {
      console.error('❌ No se pudo obtener el ID del cliente del token');
      this.loading = false;
      this.cd.detectChanges();
      return;
    }

    // 1. Obtener el usuario completo por su ID
    this.usuariosService.getUserById(clienteId).subscribe({
      next: (userResp: any) => {
        console.log('🔍 Respuesta completa del backend:', userResp);
        console.log('🔍 Tipo de respuesta:', typeof userResp);
        console.log('🔍 Keys disponibles:', Object.keys(userResp || {}));
        
        const user = userResp?.userResponse || userResp?.user || userResp;
        console.log('🔍 Usuario extraído:', user);
        console.log('🔍 Tipo de usuario:', typeof user);
        console.log('🔍 Keys del usuario:', Object.keys(user || {}));
        
        const empresaCliente = user?.empresa_cliente;
        console.log('🔍 Campo empresa_cliente encontrado:', empresaCliente);
        
        if (!empresaCliente) {
          console.error('❌ El usuario no tiene empresa_cliente');
          console.error('❌ Usuario completo:', user);
          this.loading = false;
          this.cd.detectChanges();
          return;
        }
        
        console.log('🏢 Empresa del cliente logueado:', empresaCliente);
        
        // 2. Buscar la empresa por nombre para obtener su ID
        this.empresaService.getClientesEmpresa().subscribe({
          next: (empresas) => {
            console.log('🔍 Todas las empresas:', empresas);
            console.log('🔍 Buscando empresa con nombre:', empresaCliente);
            
            const empresa = empresas.find((e: any) => e.nombre_empresa === empresaCliente);
            console.log('🔍 Empresa encontrada:', empresa);
            
            if (empresa) {
              const empresaId = empresa._id;
              console.log('🏢 ID de empresa encontrado:', empresaId);
              console.log('🏢 Nombre de empresa:', empresa.nombre_empresa);
              
              // 3. Ahora traer las embarcaciones y filtrar por nombre de empresa
              this.cargarEmbarcacionesPorEmpresaId(empresaCliente);
            } else {
              console.error('❌ No se encontró la empresa:', empresaCliente);
              console.error('❌ Empresas disponibles:', empresas.map((e: any) => e.nombre_empresa));
              this.loading = false;
              this.cd.detectChanges();
            }
          },
          error: (error) => {
            console.error('❌ Error al obtener empresas:', error);
            this.loading = false;
            this.cd.detectChanges();
          }
        });
      },
      error: (error) => {
        console.error('❌ Error al obtener usuario:', error);
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.searchSubject.complete();
  }

  initSelectOptions() {
    this.countryOptions = [
      ...new Set(this.embarcaciones.map(e => e.country).filter(Boolean))
    ];

    this.portOptions = [
      ...new Set(this.embarcaciones.map(e => e.port).filter(Boolean))
    ];

    this.operadorOptions = [
      ...new Set(this.embarcaciones.map(e => e.operador).filter(Boolean))
    ];
  }

  initTimers() {
    const now = Date.now();
    this.embarcaciones.forEach(e => {
      if (e.estado_actual === 'aprobado') {
        if (!this.timers[e.da_numero]) {
          // ✅ CAMBIO AQUÍ → 20 segundos
          this.timers[e.da_numero] = now + 20 * 1000;
        }
      }
    });
  }

  startTimerInterval() {
    this.intervalId = setInterval(() => {
      // Solo refrescar si hay embarcaciones aprobadas
      const hasApproved = this.embarcaciones.some(e => e.estado_actual === 'aprobado');
      if (hasApproved) {
        // Obliga a Angular a refrescar la vista
        this.embarcaciones = [...this.embarcaciones];
      }
    }, 1000);
  }

  get embarcacionesFiltradas() {
    const now = Date.now();

    const todasLasEmbarcaciones = this.embarcaciones.filter(e => {
      // Solo ocultar las aprobadas que hayan vencido
      if (e.estado_actual === 'aprobado') {
        const expiry = this.timers[e.da_numero];
        if (expiry && now > expiry) {
          return false;
        }
      }

      const text = this.searchText?.toLowerCase() || '';

      const matchesSearch =
        !this.searchText ||
        (e.vessel?.toLowerCase().includes(text)) ||
        (e.cliente?.toLowerCase().includes(text)) ||
        (e.operador?.toLowerCase().includes(text)) ||
        (e.port?.toLowerCase().includes(text)) ||
        (e.da_numero?.toLowerCase().includes(text));

      const matchesCountry =
        !this.selectedCountry ||
        e.country === this.selectedCountry;

      const matchesPort =
        !this.selectedPort ||
        e.port === this.selectedPort;

      const matchesStatus =
        !this.selectedStatus ||
        e.estado_actual === this.selectedStatus;

      const matchesOperador =
        !this.selectedOperador ||
        e.operador === this.selectedOperador;

      return matchesSearch &&
             matchesCountry &&
             matchesPort &&
             matchesStatus &&
             matchesOperador;
    });

    // Calcular paginación
    this.totalPages = Math.ceil(todasLasEmbarcaciones.length / this.itemsPerPage);
    
    // Aplicar paginación
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    return todasLasEmbarcaciones.slice(startIndex, endIndex);
  }

  // Métodos para manejar la paginación
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get paginationInfo() {
    const totalItems = this.embarcacionesFiltradas.length;
    const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);
    
    return {
      startItem,
      endItem,
      totalItems,
      currentPage: this.currentPage,
      totalPages: this.totalPages
    };
  }

  onSearchChange(event: any) {
    this.searchSubject.next(event.target.value);
    this.resetPagination();
  }

  // Método para resetear la paginación cuando cambian los filtros
  resetPagination() {
    this.currentPage = 1;
  }

  // Método para cambiar el número de elementos por página
  changeItemsPerPage(newLimit: number) {
    this.itemsPerPage = newLimit;
    this.currentPage = 1; // Resetear a la primera página
  }

  getRemainingTime(daNumero: string): string {
    const expiry = this.timers[daNumero];
    if (!expiry) return '-';
    const remainingMs = expiry - Date.now();

    if (remainingMs <= 0) return 'Expirado';

    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'aprobado': return 'success';
      case 'en_proceso': return 'warning';
      case 'observaciones': return 'danger';
      default: return 'medium';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'aprobado': return 'checkmark-circle';
      case 'en_proceso': return 'alert-circle';
      case 'observaciones': return 'close-circle';
      default: return 'help-circle';
    }
  }

  // Método para obtener el ícono del estado (compatibilidad con el componente base)
  getEstadoIcono(estado: string): string {
    return this.getEstadoIcon(estado);
  }

  formatDate(date: string) {
    if (!date) return '-';
    
    try {
      const fecha = new Date(date);
      if (isNaN(fecha.getTime())) return '-';
      
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const año = fecha.getFullYear();
      
      return `${dia}-${mes}-${año}`;
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '-';
    }
  }

  // Getters para el resumen impactante
  get totalEmbarcaciones(): number {
    return this.embarcaciones.length;
  }

  get cantidadAprobadas(): number {
    return this.embarcaciones.filter(e => e.estado_actual === 'aprobado').length;
  }

  get cantidadEnProceso(): number {
    return this.embarcaciones.filter(e => e.estado_actual === 'en_proceso').length;
  }

  get cantidadObservaciones(): number {
    return this.embarcaciones.filter(e => e.estado_actual === 'observaciones').length;
  }

  cargarEmbarcacionesPorEmpresaId(empresaCliente: string) {
    console.log('🔍 Cargando embarcaciones por nombre de empresa:', empresaCliente);

    this.embarcacionesService.getEmbarcacionesReporteCompleto().subscribe({
      next: (data) => {
        console.log('🔍 Todas las embarcaciones:', data);
        console.log('🔍 Primera embarcación:', data[0]);
        console.log('🔍 Campos de la primera embarcación:', Object.keys(data[0] || {}));

        // Verificar qué campo contiene el nombre de la empresa
        const primeraEmbarcacion = data[0];
        if (primeraEmbarcacion) {
          console.log('🔍 Campo cliente:', primeraEmbarcacion.cliente);
          console.log('🔍 Campo empresa_id:', primeraEmbarcacion.empresa_id);
          console.log('🔍 Campo id_empresa:', primeraEmbarcacion.id_empresa);
          console.log('🔍 Campo empresa:', primeraEmbarcacion.empresa);
          console.log('🔍 Campo empresa_cliente:', primeraEmbarcacion.empresa_cliente);
          console.log('🔍 Campo nombre_empresa:', primeraEmbarcacion.nombre_empresa);
          console.log('🔍 TODOS los campos de la primera embarcación:', primeraEmbarcacion);
        }

        // Mostrar todos los valores únicos del campo cliente
        const clientesUnicos = [...new Set(data.map((e: any) => e.cliente))];
        console.log('🔍 Todos los valores únicos del campo cliente:', clientesUnicos);
        console.log('🔍 Nombre de empresa que buscamos:', empresaCliente);
        console.log('🔍 ¿Existe en la lista?', clientesUnicos.includes(empresaCliente));

        // Filtrar embarcaciones por nombre de empresa
        const embarcacionesDeLaEmpresa = data.filter((embarcacion: any) => {
          // Verificar todos los posibles campos donde puede estar el nombre de empresa
          const nombreEmpresaEmbarcacion = 
            embarcacion.cliente || 
            embarcacion.empresa || 
            embarcacion.empresa_cliente || 
            embarcacion.nombre_empresa;

          // También verificar si el nombre de la empresa está en el nombre del buque
          const nombreEnVessel = embarcacion.vessel?.toLowerCase().includes(empresaCliente.toLowerCase());

          console.log('🔍 Comparando embarcación:', embarcacion.vessel);
          console.log('  - Nombre empresa embarcación:', nombreEmpresaEmbarcacion);
          console.log('  - Nombre empresa usuario:', empresaCliente);
          console.log('  - ¿Coinciden en campos?', nombreEmpresaEmbarcacion === empresaCliente);
          console.log('  - ¿Coinciden en vessel?', nombreEnVessel);

          return nombreEmpresaEmbarcacion === empresaCliente || nombreEnVessel;
        });

        console.log('🔍 Embarcaciones filtradas por nombre de empresa:', embarcacionesDeLaEmpresa);
        console.log('📊 Total de embarcaciones encontradas:', embarcacionesDeLaEmpresa.length);

        this.embarcaciones = embarcacionesDeLaEmpresa.map((e: any, index: number) => ({
          ...e,
          _id: e.da_numero || `sin-id-${index}`
        }));
        this.initSelectOptions();
        this.initTimers();
        this.startTimerInterval();
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error al obtener embarcaciones:', error);
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

}
