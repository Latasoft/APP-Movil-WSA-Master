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
  IonItemDivider
} from '@ionic/angular/standalone';

import { ReportesCustomService } from 'src/app/services/reportes-custom.service';

import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs;

@Component({
  selector: 'app-vessels-by-services',
  templateUrl: './vessels-by-services.page.html',
  styleUrls: ['./vessels-by-services.page.scss'],
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
  ]
})
export class VesselsByServicesPage implements OnInit {
  fechaDesdeStr: string = '';
  fechaHastaStr: string = '';
  fechaDesdeISO: string | null = null;
  fechaHastaISO: string | null = null;

  embarcacionesTodas: any[] = [];
  embarcacionesFiltradas: any[] = [];

  totalVessels: number = 0;
  formatoReporte: string = '';

  serviciosUnicos: string[] = [];
  serviciosSeleccionados: string[] = [];
  daNumeroFiltro: string = '';
  clientesUnicos: string[] = [];
  clientesSeleccionados: string[] = [];
  paisesUnicos: string[] = [];
  paisesSeleccionados: string[] = [];
  puertosUnicos: string[] = [];
  puertosSeleccionados: string[] = [];

  // Diccionario de puertos a países de América
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

  constructor(private reportesService: ReportesCustomService) { }

  ngOnInit() {
    this.cargarServiciosEstructura();
    this.cargarTodasLasEmbarcaciones();
    // Mostrar los datos de embarcaciones al iniciar (puede estar vacío hasta que llegue la respuesta)
    console.log('Embarcaciones al iniciar:', this.embarcacionesTodas);
  }

  // Devuelve el país según el puerto, o null si no está en el diccionario
  getPaisPorPuerto(puerto: string): string | null {
    if (!puerto) return null;
    
    // Normalizar el puerto: eliminar espacios extra, convertir a mayúsculas
    const puertoNormalizado = puerto.trim().toUpperCase();
    
    // Buscar coincidencia exacta
    if (this.PUERTOS_PAISES[puertoNormalizado]) {
      return this.PUERTOS_PAISES[puertoNormalizado];
    }
    
    // Buscar coincidencia parcial (por si el puerto tiene texto adicional)
    for (const [puertoKey, pais] of Object.entries(this.PUERTOS_PAISES)) {
      if (puertoNormalizado.includes(puertoKey) || puertoKey.includes(puertoNormalizado)) {
        return pais;
      }
    }
    
    // Manejar casos especiales con errores tipográficos comunes
    const casosEspeciales: { [key: string]: string } = {
      'VALAPRARISO': 'Chile', // Error tipográfico común
      'VALPARAISO': 'Chile',   // Sin 'S'
      'BUENOS AIRES': 'Argentina', // Asegurar que sea Argentina
      'SAN ANTONIO': 'Chile',  // Asegurar que sea Chile
    };
    
    if (casosEspeciales[puertoNormalizado]) {
      return casosEspeciales[puertoNormalizado];
    }
    
    // Si no encuentra coincidencia, devolver null
    return null;
  }

  cargarServiciosEstructura() {
    this.reportesService.getEstructuraServicios().subscribe({
      next: (data: any[]) => {
        this.serviciosUnicos = data.map(s => s.principal).sort();
        this.serviciosSeleccionados = ['ALL'];
      },
      error: (err) => console.error(err)
    });
  }

  cargarTodasLasEmbarcaciones() {
    this.reportesService.getAllEmbarcaciones().subscribe({
      next: (data: any[]) => {
        this.embarcacionesTodas = data;
        console.log('Embarcaciones recibidas:', data);
        this.clientesUnicos = Array.from(new Set(data.map(e => e.nombre_empresa_cliente || 'NO DISPONIBLE'))).sort();
        this.paisesUnicos = Array.from(new Set(data.map(e => this.getPaisPorPuerto(e.destino_embarcacion) || 'NO DISPONIBLE'))).sort();
        this.puertosUnicos = Array.from(new Set(data.map(e => e.destino_embarcacion || 'NO DISPONIBLE'))).sort();
        this.filtrarTodo();
      },
      error: (err) => console.error(err)
    });
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
      formateado = valor.slice(0, 2) + '-' + valor.slice(2, 4) + '-' + valor.slice(4, 8);
    }
    if (formateado.length > 10) {
      formateado = formateado.slice(0, 10);
    }
    if (campo === 'desde') {
      this.fechaDesdeStr = formateado;
      this.fechaDesdeISO = formateado.length === 10 ? this.parseDateString(formateado) : null;
    } else {
      this.fechaHastaStr = formateado;
      this.fechaHastaISO = formateado.length === 10 ? this.parseDateString(formateado) : null;
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

  filtrarTodo() {
    // Filtrar embarcaciones por todos los criterios
    this.embarcacionesFiltradas = this.embarcacionesTodas.filter((e: any) => {
      if (!e.fecha_arribo || e.fecha_arribo === 'N/A') return false;
      const fechaArribo = new Date(e.fecha_arribo);
      if (isNaN(fechaArribo.getTime())) return false;
      if (this.fechaDesdeISO) {
        const desde = new Date(this.fechaDesdeISO);
        if (fechaArribo < desde) return false;
      }
      if (this.fechaHastaISO) {
        const hasta = new Date(this.fechaHastaISO);
        hasta.setHours(23, 59, 59, 999);
        if (fechaArribo > hasta) return false;
      }
      // Filtro DA N° exacto y exclusivo
      if (this.daNumeroFiltro && e.da_numero !== this.daNumeroFiltro) return false;
      // Filtro Servicio: buscar coincidencia en servicios_relacionados[].servicio_principal
      const allServicios = this.serviciosSeleccionados.includes('ALL') || this.serviciosSeleccionados.length === 0;
      let matchServicio = true;
      if (!allServicios) {
        matchServicio = Array.isArray(e.servicios_relacionados) &&
          e.servicios_relacionados.some((serv: any) => this.serviciosSeleccionados.includes(serv.servicio_principal));
      }
      // Filtro Cliente (nombre_empresa_cliente)
      const cliente = e.nombre_empresa_cliente || 'NO DISPONIBLE';
      const allClientes = this.clientesSeleccionados.includes('ALL');
      const matchCliente = allClientes || this.clientesSeleccionados.length === 0 || this.clientesSeleccionados.includes(cliente);
      // Filtro País
      const pais = this.getPaisPorPuerto(e.destino_embarcacion) || 'NO DISPONIBLE';
      const allPaises = this.paisesSeleccionados.includes('ALL');
      const matchPais = allPaises || this.paisesSeleccionados.length === 0 || this.paisesSeleccionados.includes(pais);
      // Filtro Puerto
      const puerto = e.destino_embarcacion || 'NO DISPONIBLE';
      const allPuertos = this.puertosSeleccionados.includes('ALL');
      const matchPuerto = allPuertos || this.puertosSeleccionados.length === 0 || this.puertosSeleccionados.includes(puerto);
      return matchServicio && matchCliente && matchPais && matchPuerto;
    });
    this.totalVessels = this.embarcacionesFiltradas.length;
    // Actualizar combos en cascada
    this.paisesUnicos = Array.from(new Set(this.embarcacionesFiltradas.map(e => this.getPaisPorPuerto(e.destino_embarcacion) || 'NO DISPONIBLE'))).sort();
    // Solo clientes de embarcaciones que tienen el servicio seleccionado (nombre_empresa_cliente)
    let clientesFiltrados: string[] = [];
    if (this.serviciosSeleccionados.length === 0 || this.serviciosSeleccionados.includes('ALL')) {
      clientesFiltrados = this.embarcacionesFiltradas.map(e => e.nombre_empresa_cliente || 'NO DISPONIBLE');
    } else {
      clientesFiltrados = this.embarcacionesFiltradas
        .filter(e => Array.isArray(e.servicios_relacionados) && e.servicios_relacionados.some((serv: any) => this.serviciosSeleccionados.includes(serv.servicio_principal)))
        .map(e => e.nombre_empresa_cliente || 'NO DISPONIBLE');
    }
    this.clientesUnicos = Array.from(new Set(clientesFiltrados)).sort();
    this.puertosUnicos = Array.from(new Set(this.embarcacionesFiltradas.map(e => e.destino_embarcacion || 'NO DISPONIBLE'))).sort();
    console.log('Embarcaciones filtradas:', this.embarcacionesFiltradas);
  }

  toggleServicio(servicio: string) {
    if (this.serviciosSeleccionados.includes(servicio)) {
      this.serviciosSeleccionados = this.serviciosSeleccionados.filter(s => s !== servicio);
    } else {
      this.serviciosSeleccionados.push(servicio);
    }
    if (this.serviciosSeleccionados.length === 0) {
      this.serviciosSeleccionados = ['ALL'];
    } else if (this.serviciosSeleccionados.length > 1 && this.serviciosSeleccionados.includes('ALL')) {
      this.serviciosSeleccionados = this.serviciosSeleccionados.filter(s => s !== 'ALL');
    }
    this.filtrarTodo();
  }

  toggleCliente(cliente: string) {
    if (this.clientesSeleccionados.includes(cliente)) {
      this.clientesSeleccionados = this.clientesSeleccionados.filter(c => c !== cliente);
    } else {
      this.clientesSeleccionados.push(cliente);
    }
    if (this.clientesSeleccionados.length === 0) {
      this.clientesSeleccionados = ['ALL'];
    } else if (this.clientesSeleccionados.length > 1 && this.clientesSeleccionados.includes('ALL')) {
      this.clientesSeleccionados = this.clientesSeleccionados.filter(c => c !== 'ALL');
    }
    this.filtrarTodo();
  }

  togglePais(pais: string) {
    if (this.paisesSeleccionados.includes(pais)) {
      this.paisesSeleccionados = this.paisesSeleccionados.filter(p => p !== pais);
    } else {
      this.paisesSeleccionados.push(pais);
    }
    if (this.paisesSeleccionados.length === 0) {
      this.paisesSeleccionados = ['ALL'];
    } else if (this.paisesSeleccionados.length > 1 && this.paisesSeleccionados.includes('ALL')) {
      this.paisesSeleccionados = this.paisesSeleccionados.filter(p => p !== 'ALL');
    }
    this.filtrarTodo();
  }

  togglePuerto(puerto: string) {
    if (this.puertosSeleccionados.includes(puerto)) {
      this.puertosSeleccionados = this.puertosSeleccionados.filter(p => p !== puerto);
    } else {
      this.puertosSeleccionados.push(puerto);
    }
    if (this.puertosSeleccionados.length === 0) {
      this.puertosSeleccionados = ['ALL'];
    } else if (this.puertosSeleccionados.length > 1 && this.puertosSeleccionados.includes('ALL')) {
      this.puertosSeleccionados = this.puertosSeleccionados.filter(p => p !== 'ALL');
    }
    this.filtrarTodo();
  }

  limpiarFiltros() {
    this.fechaDesdeStr = '';
    this.fechaHastaStr = '';
    this.fechaDesdeISO = null;
    this.fechaHastaISO = null;
    this.daNumeroFiltro = '';
    this.serviciosSeleccionados = ['ALL'];
    this.clientesSeleccionados = ['ALL'];
    this.paisesSeleccionados = ['ALL'];
    this.puertosSeleccionados = ['ALL'];
    this.filtrarTodo();
  }

  generarReporte() {
    if (!this.formatoReporte) {
      alert('Debes seleccionar el formato de reporte (Excel o PDF).');
      return;
    }
    if (this.formatoReporte === 'excel') {
      this.generarExcel();
    } else if (this.formatoReporte === 'pdf') {
      this.generarPDFHorizontal();
    }
  }

  generarExcel() {
    if (this.embarcacionesFiltradas.length === 0) {
      alert('No hay datos para exportar a Excel.');
      return;
    }
    const rows: any[][] = [];
    rows.push(["VESSELS BY SERVICES REPORT"]);
    rows.push([]);
    rows.push([
      'FROM:',
      this.fechaDesdeStr || '---',
      '',
      'TO:',
      this.fechaHastaStr || '---'
    ]);
    rows.push([]);
    rows.push(['TOTAL VESSELS:', this.totalVessels]);
    rows.push(['SERVICES:', this.getResumenServicios()]);
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
    this.embarcacionesFiltradas.forEach((e: any) => {
      rows.push([
        e.da_numero || '',
        e.titulo_embarcacion || '',
        e.destino_embarcacion || '',
        this.getPaisPorPuerto(e.destino_embarcacion) || 'NO DISPONIBLE',
        e.fecha_arribo ? this.formatDate(e.fecha_arribo) : 'N/A',
        e.fecha_zarpe ? this.formatDate(e.fecha_zarpe) : 'N/A',
        e.nombre_empresa_cliente || 'NO DISPONIBLE'
      ]);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(rows);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vessels By Services');
    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array'
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, 'Vessels_By_Services_Report.xlsx');
    console.log('Excel generado correctamente.');
  }

  generarPDFHorizontal() {
    if (this.embarcacionesFiltradas.length === 0) {
      alert('No hay datos para exportar a PDF.');
      return;
    }
    // Obtener el servicio principal seleccionado para mostrar en el resumen
    let serviciosResumen = 'NO DISPONIBLE';
    if (this.serviciosSeleccionados.length > 0 && !this.serviciosSeleccionados.includes('ALL')) {
      serviciosResumen = this.serviciosSeleccionados.join(', ');
    }
    // Eliminar logo SVG de la cabecera
    const detailsTable = [
      [
        { text: '#', style: 'tableHeaderPDF' },
        { text: 'DA ID', style: 'tableHeaderPDF' },
        { text: 'VESSEL', style: 'tableHeaderPDF' },
        { text: 'PORT', style: 'tableHeaderPDF' },
        { text: 'COUNTRY', style: 'tableHeaderPDF' },
        { text: 'ETA', style: 'tableHeaderPDF' },
        { text: 'ETD', style: 'tableHeaderPDF' },
        { text: 'CUSTOMER', style: 'tableHeaderPDF' }
      ],
      ...this.embarcacionesFiltradas.map((e: any, idx: number) => [
        { text: (idx + 1).toString(), style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' },
        { text: e.da_numero || '', style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' },
        { text: e.titulo_embarcacion || '', style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' },
        { text: e.destino_embarcacion || '', style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' },
        { text: this.getPaisPorPuerto(e.destino_embarcacion) || 'NO DISPONIBLE', style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' },
        { text: e.fecha_arribo ? this.formatDate(e.fecha_arribo) : 'N/A', style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' },
        { text: e.fecha_zarpe ? this.formatDate(e.fecha_zarpe) : 'N/A', style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' },
        { text: e.nombre_empresa_cliente || 'NO DISPONIBLE', style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' }
      ]),
      [
        { text: '', colSpan: 8, style: 'tableHeaderPDF' }, '', '', '', '', '', '', ''
      ]
    ];
    const docDefinition: any = {
      pageOrientation: 'landscape',
      content: [
        { text: 'VESSELS BY SERVICES REPORT', style: 'headerPDF' },
        { text: `FROM: ${this.fechaDesdeStr || '---'}   TO: ${this.fechaHastaStr || '---'}` },
        { text: `TOTAL VESSELS: ${this.totalVessels}` },
        { text: `SERVICES: ${serviciosResumen}` },
        { text: ' ' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', '*', '*', '*', '*', '*'],
            body: detailsTable
          },
          layout: {
            fillColor: (rowIndex: number) => {
              if (rowIndex === 0) return '#15395b';
              return null;
            }
          }
        }
      ],
      styles: {
        headerPDF: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
          color: '#15395b'
        },
        tableHeaderPDF: {
          bold: true,
          fontSize: 12,
          color: 'white',
          fillColor: '#15395b',
          alignment: 'center'
        },
        tableCellEvenPDF: {
          fontSize: 10,
          color: '#15395b',
          fillColor: '#f5f6fa',
          alignment: 'center'
        },
        tableCellOddPDF: {
          fontSize: 10,
          color: '#15395b',
          fillColor: 'white',
          alignment: 'center'
        }
      }
    };
    pdfMake.createPdf(docDefinition).open();
  }

  formatDate(dateISO: string): string {
    if (!dateISO) return '';
    const date = new Date(dateISO);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  /**
   * Devuelve el string de servicios únicos de las embarcaciones filtradas para el resumen
   */
  getResumenServicios(): string {
    if (!this.embarcacionesFiltradas || this.embarcacionesFiltradas.length === 0) {
      return 'NO DISPONIBLE';
    }
    // Juntar todos los servicios de todas las embarcaciones filtradas
    const servicios = this.embarcacionesFiltradas
      .flatMap(e => Array.isArray(e.servicios) ? e.servicios.map((s: any) => s.nombre_servicio) : [])
      .filter((v, i, a) => !!v && a.indexOf(v) === i);
    console.log('Servicios encontrados:', servicios);
    if (servicios.length === 0) {
      return 'NO DISPONIBLE';
    }
    return servicios.join(', ');
  }
}
