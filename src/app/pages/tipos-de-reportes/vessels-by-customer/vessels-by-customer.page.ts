import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonLabel,
  IonList,
  IonFooter,
  IonCheckbox,
  IonItemDivider,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';

import { ReportesCustomService } from 'src/app/services/reportes-custom.service';
import { EmpresaService } from 'src/app/services/empresa.service';

import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs;

@Component({
  selector: 'app-vessels-by-customer',
  templateUrl: './vessels-by-customer.page.html',
  styleUrls: ['./vessels-by-customer.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonLabel,
    IonList,
    IonFooter,
    IonCheckbox,
    IonItemDivider
  ],
  providers: [ToastController, LoadingController]
})
export class VesselsByCustomerPage implements OnInit {

  fechaDesdeStr: string = '';
  fechaHastaStr: string = '';
  fechaDesdeISO: string | null = null;
  fechaHastaISO: string | null = null;

  embarcacionesTodas: any[] = [];
  embarcacionesFiltradas: any[] = [];

  totalVessels: number = 0;
  formatoReporte: string = '';

  vesselsByCountry: Record<string, number> = {};

  clientesUnicos: string[] = [];
  paisesUnicos: string[] = [];

  clientesSeleccionados: string[] = [];
  paisesSeleccionados: string[] = [];

  clientesEmpresa: any[] = [];

  embarcaciones: any[] = [];

  mensajeFiltroPais: string = '';

  isLoadingReporte: boolean = false;

  // Diccionario de puertos a países de América (sin normalizar)
  private PUERTOS_PAISES_ORIGINAL: { [key: string]: string } = {
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
    'PUERTO ANGAMOS': 'Chile',
    'PUERTO NATALES': 'Chile',
    'PUERTO WILLIAMS': 'Chile',
    'PUERTO CHACABUCO': 'Chile',
    'PUERTO AYSEN': 'Chile',
    'PUERTO VARAS': 'Chile',
    // Argentina
    'BUENOS AIRES': 'Argentina',
    'ROSARIO': 'Argentina',
    'LA PLATA': 'Argentina',
    'MAR DEL PLATA': 'Argentina',
    'PUERTO MADRYN': 'Argentina',
    'USHUAIA': 'Argentina',
    'PUERTO DESEADO': 'Argentina',
    'PUERTO SAN JULIAN': 'Argentina',
    'PUERTO SANTA CRUZ': 'Argentina',
    'PUERTO RICO': 'Argentina',
    // Uruguay
    'MONTEVIDEO': 'Uruguay',
    'NUEVA PALMIRA': 'Uruguay',
    'COLONIA': 'Uruguay',
    'PUERTO COLONIA': 'Uruguay',
    // Brasil
    'SANTOS': 'Brasil',
    'RIO DE JANEIRO': 'Brasil',
    'PARANAGUA': 'Brasil',
    'ITAJAI': 'Brasil',
    'PORTO ALEGRE': 'Brasil',
    'SALVADOR': 'Brasil',
    'RECIFE': 'Brasil',
    'FORTALEZA': 'Brasil',
    'BELEM': 'Brasil',
    'MANAUS': 'Brasil',
    // Perú
    'CALLAO': 'Perú',
    'PAITA': 'Perú',
    'CHIMBOTE': 'Perú',
    'SALAVERRY': 'Perú',
    'PUERTO CHICAMA': 'Perú',
    'PUERTO BAYOVAR': 'Perú',
    // Colombia
    'BARRANQUILLA': 'Colombia',
    'CARTAGENA': 'Colombia',
    'BUENAVENTURA': 'Colombia',
    'SANTA MARTA': 'Colombia',
    'TUMACO': 'Colombia',
    'PUERTO BOLIVAR': 'Colombia',
    // Ecuador
    'GUAYAQUIL': 'Ecuador',
    'MANTA': 'Ecuador',
    'ESMERALDAS': 'Ecuador',
    // Panamá
    'COLON': 'Panamá',
    'BALBOA': 'Panamá',
    'PUERTO CRISTOBAL': 'Panamá',
    // México
    'VERACRUZ': 'México',
    'MANZANILLO': 'México',
    'LAZARO CARDENAS': 'México',
    'ALTAMIRA': 'México',
    'TAMPICO': 'México',
    'ENSENADA': 'México',
    'MAZATLAN': 'México',
    'ACAPULCO': 'México',
    // Estados Unidos
    'LOS ANGELES': 'Estados Unidos',
    'LONG BEACH': 'Estados Unidos',
    'MIAMI': 'Estados Unidos',
    'NEW YORK': 'Estados Unidos',
    'HOUSTON': 'Estados Unidos',
    'NEW ORLEANS': 'Estados Unidos',
    'SEATTLE': 'Estados Unidos',
    'SAN FRANCISCO': 'Estados Unidos',
    'BOSTON': 'Estados Unidos',
    'PHILADELPHIA': 'Estados Unidos',
    'BALTIMORE': 'Estados Unidos',
    'SAVANNAH': 'Estados Unidos',
    'CHARLESTON': 'Estados Unidos',
    // Canadá
    'VANCOUVER': 'Canadá',
    'MONTREAL': 'Canadá',
    'QUEBEC': 'Canadá',
    'TORONTO': 'Canadá',
    'HALIFAX': 'Canadá',
  };

  private PUERTOS_PAISES: { [key: string]: string } = {};

  private CASOS_ESPECIALES_ORIGINAL: { [key: string]: string } = {
    'VALAPRARISO': 'Chile',
    'VALPARAISO': 'Chile',
    'BUENOS AIRES': 'Argentina',
    'SAN ANTONIO': 'Chile',
    'BUENOSAIRES': 'Argentina',
    'SANANTONIO': 'Chile',
  };

  private casosEspeciales: { [key: string]: string } = {};

  constructor(
    private reportesService: ReportesCustomService,
    private empresaService: EmpresaService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    // Normalizar claves de PUERTOS_PAISES
    Object.entries(this.PUERTOS_PAISES_ORIGINAL).forEach(([k, v]) => {
      this.PUERTOS_PAISES[this.normalizarPuerto(k)] = v;
    });
    // Normalizar claves de casosEspeciales
    Object.entries(this.CASOS_ESPECIALES_ORIGINAL).forEach(([k, v]) => {
      this.casosEspeciales[this.normalizarPuerto(k)] = v;
    });
  }

  ngOnInit() {
    this.cargarClientesEmpresa();
    this.cargarTotalVessels();
    this.cargarVesselsByCountry();
    this.cargarTodasLasEmbarcaciones();
    this.reportesService.getEmbarcacionesConNombreCliente().subscribe(embarcaciones => {
      this.embarcaciones = embarcaciones;
    });
  }

  cargarClientesEmpresa() {
    this.empresaService.getClientesEmpresa().subscribe({
      next: (empresas: any[]) => {
        this.clientesEmpresa = empresas;
        this.clientesUnicos = empresas.map(e => e.nombre_empresa || 'NO DISPONIBLE').sort();
        this.clientesSeleccionados = ['ALL'];
      },
      error: (err) => {
        console.error('Error al cargar empresas cliente', err);
        this.clientesUnicos = ['NO DISPONIBLE'];
      }
    });
  }

  cargarTodasLasEmbarcaciones() {
    this.reportesService.getAllEmbarcaciones().subscribe({
      next: (data: any[]) => {
        this.embarcacionesTodas = data;
        this.paisesUnicos = Array.from(
          new Set<string>(
            data
              .map((e: any) => this.getPaisPorPuerto(e.destino_embarcacion) || 'NO DISPONIBLE')
              .filter((p: string) => !!p)
          )
        ).sort();
        this.paisesSeleccionados = ['ALL'];
        this.filtrarTodo();
      },
      error: (err) => console.error(err)
    });
  }

  cargarTotalVessels() {
    this.reportesService.countEmbarcaciones().subscribe({
      next: (data: any) => {
        this.totalVessels = data.total_vessels;
      },
      error: (err) => console.error(err)
    });
  }

  cargarVesselsByCountry() {
    this.reportesService.reportEmbarcacionesByCountry().subscribe({
      next: (data: any) => {
        this.vesselsByCountry = data.by_country;
      },
      error: (err) => console.error(err)
    });
  }

  getCountriesKeys(): string[] {
    return Object.keys(this.vesselsByCountry);
  }

  // Normaliza el nombre del puerto: mayúsculas, sin espacios ni tildes
  normalizarPuerto(puerto: string): string {
    if (!puerto) return '';
    return puerto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quita tildes
      .replace(/\s+/g, '') // quita espacios
      .toUpperCase();
  }

  getPaisPorPuerto(puerto: string): string | null {
    if (!puerto) return null;
    const puertoNormalizado = this.normalizarPuerto(puerto);
    console.log('Buscando puerto:', puerto, 'Normalizado:', puertoNormalizado);
    console.log('Diccionario:', this.PUERTOS_PAISES);
    if (this.PUERTOS_PAISES[puertoNormalizado]) {
      console.log('¡Encontrado!', puertoNormalizado, '->', this.PUERTOS_PAISES[puertoNormalizado]);
      return this.PUERTOS_PAISES[puertoNormalizado];
    }
    // Buscar coincidencia parcial robusta
    for (const [puertoKey, pais] of Object.entries(this.PUERTOS_PAISES)) {
      if (
        puertoNormalizado.includes(puertoKey) ||
        puertoKey.includes(puertoNormalizado)
      ) {
        console.log('Coincidencia parcial:', puertoNormalizado, '<->', puertoKey, '->', pais);
        return pais;
      }
    }
    // Manejar casos especiales con errores tipográficos comunes
    if (this.casosEspeciales[puertoNormalizado]) {
      console.log('Caso especial:', puertoNormalizado, '->', this.casosEspeciales[puertoNormalizado]);
      return this.casosEspeciales[puertoNormalizado];
    }
    console.log('No encontrado:', puertoNormalizado);
    // Si no encuentra coincidencia, devolver null
    return null;
  }

  onInputFecha(event: any, campo: 'desde' | 'hasta') {
    let valor: string = event.target.value || '';
    valor = valor.replace(/\D/g, '');

    let formateado = '';

    if (valor.length <= 2) {
      formateado = valor;
    } else if (valor.length <= 4) {
      formateado = valor.slice(0, 2) + '-' + valor.slice(2);
    } else {
      formateado =
        valor.slice(0, 2) +
        '-' +
        valor.slice(2, 4) +
        '-' +
        valor.slice(4, 8);
    }

    if (formateado.length > 10) {
      formateado = formateado.slice(0, 10);
    }

    if (campo === 'desde') {
      this.fechaDesdeStr = formateado;
      this.fechaDesdeISO =
        formateado.length === 10 ? this.parseDateString(formateado) : null;
    } else {
      this.fechaHastaStr = formateado;
      this.fechaHastaISO =
        formateado.length === 10 ? this.parseDateString(formateado) : null;
    }

    this.filtrarTodo();
  }

  parseDateString(dateStr: string): string | null {
    if (!dateStr) return null;

    const partes = dateStr.split('-');
    if (partes.length === 3) {
      const [day, month, year] = partes;
      return `${year}-${month}-${day}`;
    }
    return null;
  }

  async presentToast(message: string, color: 'primary' | 'success' | 'warning' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await toast.present();
  }

  async presentLoading(message: string) {
    this.isLoadingReporte = true;
    const loading = await this.loadingController.create({
      message,
      spinner: 'crescent',
      duration: 0
    });
    await loading.present();
    return loading;
  }

  async dismissLoading(loading: any) {
    this.isLoadingReporte = false;
    await loading.dismiss();
  }

  filtrarTodo() {
    let filtradas = [...this.embarcacionesTodas];
    // Filtrar por cliente
    if (!this.isAllClientesSelected() && this.clientesSeleccionados.length > 0) {
      filtradas = filtradas.filter((e: any) => {
        const nombreCliente = this.getNombreClientePorId(e);
        return this.clientesSeleccionados.includes(nombreCliente);
      });
    }
    // Filtrar por país
    if (this.paisesSeleccionados.length > 0 && !this.isAllPaisesSelected()) {
      filtradas = filtradas.filter((e: any) =>
        this.paisesSeleccionados.some(
          paisSel =>
            (e.pais_embarcacion || '').toString().trim().toLowerCase() === paisSel.toString().trim().toLowerCase()
        )
      );
    }
    // Filtrar por fecha
    if (this.fechaDesdeISO && this.fechaHastaISO) {
      const from = new Date(this.fechaDesdeISO);
      const to = new Date(this.fechaHastaISO);
      filtradas = filtradas.filter((e: any) => {
        if (!e.fecha_arribo) return false;
        const fechaArribo = new Date(e.fecha_arribo);
        return fechaArribo >= from && fechaArribo <= to;
      });
    }
    this.embarcacionesFiltradas = filtradas;
    this.totalVessels = this.embarcacionesFiltradas.length;
    this.vesselsByCountry = {};
    this.embarcacionesFiltradas.forEach((e: any) => {
      const pais: string = e.pais_embarcacion || 'NO DISPONIBLE';
      this.vesselsByCountry[pais] = (this.vesselsByCountry[pais] || 0) + 1;
    });
    console.log('Filtradas:', this.embarcacionesFiltradas);
  }

  limpiarFiltros() {
    this.fechaDesdeStr = '';
    this.fechaHastaStr = '';
    this.fechaDesdeISO = null;
    this.fechaHastaISO = null;
    this.formatoReporte = '';

    this.paisesSeleccionados = [''];

    this.filtrarTodo();
  }

  toggleAllPaises() {
    if (this.isAllPaisesSelected()) {
      this.paisesSeleccionados = [];
    } else {
      this.paisesSeleccionados = ['ALL'];
    }
    this.filtrarTodo();
  }

  togglePais(pais: string) {
    if (this.paisesSeleccionados.includes('ALL')) {
      this.paisesSeleccionados = [];
    }

    if (this.paisesSeleccionados.includes(pais)) {
      this.paisesSeleccionados = this.paisesSeleccionados.filter((p: string) => p !== pais);
    } else {
      this.paisesSeleccionados.push(pais);
    }
    this.filtrarTodo();
  }

  isAllPaisesSelected(): boolean {
    return this.paisesSeleccionados.includes('ALL');
  }

  toggleCliente(clienteNombre: string) {
    if (this.clientesSeleccionados.includes('ALL')) {
      this.clientesSeleccionados = [];
    }
    if (this.clientesSeleccionados.includes(clienteNombre)) {
      this.clientesSeleccionados = this.clientesSeleccionados.filter((c: string) => c !== clienteNombre);
    } else {
      this.clientesSeleccionados.push(clienteNombre);
    }

    // Buscar el ID del cliente seleccionado
    const clienteObj = this.clientesEmpresa.find(e => e.nombre_empresa === clienteNombre);
    const clienteId = clienteObj?._id;

    // Filtrar embarcaciones por el ID del cliente seleccionado
    const embarcacionesClientes = this.embarcacionesTodas.filter((e: any) => {
      if (e.empresa_cliente_id && typeof e.empresa_cliente_id === 'object' && e.empresa_cliente_id._id) {
        return e.empresa_cliente_id._id === clienteId;
      }
      if (typeof e.empresa_cliente_id === 'string') {
        return e.empresa_cliente_id === clienteId;
      }
      return false;
    });

    // Obtener países únicos usando el campo pais_embarcacion
    this.paisesUnicos = Array.from(
      new Set(
        embarcacionesClientes
          .map((e: any) => e.pais_embarcacion || 'NO DISPONIBLE')
          .filter((p: string) => !!p && p !== 'NO DISPONIBLE')
      )
    ).sort();

    // Si no hay países válidos, mostrar 'NO DISPONIBLE'
    if (this.paisesUnicos.length === 0) {
      this.paisesUnicos = ['NO DISPONIBLE'];
    }

    // No seleccionar ningún país automáticamente
    this.paisesSeleccionados = [];
    this.mensajeFiltroPais = 'Solo se muestran países donde el(los) cliente(s) seleccionado(s) tiene(n) embarcaciones.';
    this.filtrarTodo();
  }

  isAllClientesSelected(): boolean {
    return this.clientesSeleccionados.includes('ALL');
  }

  async generarReporte() {
    // Validaciones de filtros
    if (this.clientesSeleccionados.length === 0 || this.isAllClientesSelected()) {
      this.presentToast('Debes seleccionar al menos un cliente.', 'warning');
      return;
    }
    if (this.paisesSeleccionados.length === 0 || this.isAllPaisesSelected()) {
      this.presentToast('Debes seleccionar al menos un país.', 'warning');
      return;
    }
    if (!this.fechaDesdeISO || !this.fechaHastaISO) {
      this.presentToast('Debes seleccionar ambas fechas (FROM y TO).', 'warning');
      return;
    }
    if (!this.formatoReporte) {
      this.presentToast('Debes seleccionar el formato de reporte (Excel o PDF).', 'warning');
      return;
    }
    if (this.embarcacionesFiltradas.length === 0) {
      this.presentToast('No hay datos para exportar. No existen reportes dentro de las fechas seleccionadas.', 'warning');
      return;
    }
    // Spinner
    const loading = await this.presentLoading('Generando reporte...');
    setTimeout(async () => {
      if (this.formatoReporte === 'excel') {
        this.generarExcel();
      } else if (this.formatoReporte === 'pdf') {
        this.generarPDFHorizontal();
      }
      await this.dismissLoading(loading);
      this.presentToast('¡Reporte descargado con éxito!', 'success');
    }, 800); // Simula tiempo de generación
  }

  generarExcel() {
    let dataFiltrada = this.embarcacionesFiltradas;
    // ya filtra por cliente, país y fecha desde filtrarTodo
    if (dataFiltrada.length === 0) {
      alert('No hay datos para exportar a Excel.');
      return;
    }
    // Log para depuración del campo nombre_empresa_cliente
    console.log('Data para reporte (nombre_empresa_cliente):', dataFiltrada.map(e => e.nombre_empresa_cliente));
    const rows: any[][] = [];
    rows.push(['VESSELS BY CUSTOMER REPORT']);
    rows.push([]);
    rows.push([
      'FROM:',
      this.fechaDesdeStr || '---',
      '',
      'TO:',
      this.fechaHastaStr || '---'
    ]);
    rows.push([]);
    rows.push(['TOTAL VESSELS:', dataFiltrada.length]);
    rows.push([]);
    rows.push(['COUNTRY:']);
    const countries = this.getCountriesKeys();
    if (countries.length > 0) {
      rows.push(countries);
      const counts = countries.map((c: string) => this.vesselsByCountry[c]);
      rows.push(counts);
    } else {
      rows.push(['NO DATA']);
    }
    rows.push([]);
    rows.push(['DETAILS:']);
    rows.push([
      'DA ID',
      'VESSEL',
      'PORT',
      'COUNTRY',
      'ETA',
      'ETD',
      'CUSTOMER'
    ]);
    dataFiltrada.forEach((e: any) => {
      let nombreEmpresa = '';
      if (e.nombre_empresa_cliente && typeof e.nombre_empresa_cliente === 'string' && e.nombre_empresa_cliente.trim()) {
        nombreEmpresa = e.nombre_empresa_cliente;
      } else if (e.empresa_cliente_id && typeof e.empresa_cliente_id === 'object' && e.empresa_cliente_id.nombre_empresa) {
        nombreEmpresa = e.empresa_cliente_id.nombre_empresa;
      } else {
        nombreEmpresa = 'NO DISPONIBLE';
      }
      // Log para depuración
      console.log('Fila:', {
        da: e.da_numero,
        vessel: e.titulo_embarcacion,
        port: e.destino_embarcacion,
        customer: nombreEmpresa,
        empresa_cliente_id: e.empresa_cliente_id
      });
      rows.push([
        e.da_numero || '',
        e.titulo_embarcacion || '',
        e.destino_embarcacion || '',
        this.getPaisPorPuerto(e.destino_embarcacion) || '',
        e.fecha_arribo || '',
        e.fecha_zarpe || '',
        nombreEmpresa
      ]);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(rows);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vessels By Customer');
    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array'
    });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'vessels_by_customer.xlsx');
  }

  generarPDFHorizontal() {
    let dataFiltrada = this.embarcacionesFiltradas;
    // ya filtra por cliente, país y fecha desde filtrarTodo
    if (dataFiltrada.length === 0) {
      this.presentToast('No hay datos para exportar a PDF. No existen reportes dentro de las fechas seleccionadas.', 'warning');
      return;
    }
    const docDefinition: any = {
      pageOrientation: 'landscape',
      content: [
        { text: 'VESSELS BY CUSTOMER REPORT', style: 'header' },
        { text: `FROM: ${this.fechaDesdeStr || '---'}   TO: ${this.fechaHastaStr || '---'}` },
        { text: `TOTAL VESSELS: ${dataFiltrada.length}` },
        { text: ' ', margin: [0, 5] },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                'DA ID',
                'VESSEL',
                'PORT',
                'COUNTRY',
                'ETA',
                'ETD',
                'CUSTOMER'
              ],
              ...dataFiltrada.map((e: any) => [
                e.da_numero || '',
                e.titulo_embarcacion || '',
                e.destino_embarcacion || '',
                e.pais_embarcacion || 'NO DISPONIBLE',
                e.fecha_arribo ? this.formatDate(e.fecha_arribo) : 'N/A',
                e.fecha_zarpe ? this.formatDate(e.fecha_zarpe) : 'N/A',
                e.nombre_empresa_cliente || 'NO DISPONIBLE'
              ])
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        }
      }
    };
    pdfMake.createPdf(docDefinition).download('vessels_by_customer.pdf');
  }

  formatDate(dateISO: string): string {
    const d = new Date(dateISO);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Devuelve el nombre del cliente asociado a la embarcación usando el ID
  getNombreClientePorId(embarcacion: any): string {
    if (embarcacion.nombre_empresa_cliente && typeof embarcacion.nombre_empresa_cliente === 'string') {
      return embarcacion.nombre_empresa_cliente;
    }
    if (embarcacion.empresa_cliente_id && typeof embarcacion.empresa_cliente_id === 'object') {
      return embarcacion.empresa_cliente_id.nombre_empresa || 'NO DISPONIBLE';
    }
    return 'NO DISPONIBLE';
  }
}
