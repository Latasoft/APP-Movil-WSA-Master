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

import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs;

@Component({
  selector: 'app-vessels-by-country',
  templateUrl: './vessels-by-country.page.html',
  styleUrls: ['./vessels-by-country.page.scss'],
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
export class VesselsByCountryPage implements OnInit {

  fechaDesdeStr: string = '';
  fechaHastaStr: string = '';
  fechaDesdeISO: string | null = null;
  fechaHastaISO: string | null = null;

  embarcacionesTodas: any[] = [];
  embarcacionesFiltradas: any[] = [];

  totalVessels: number = 0;
  formatoReporte: string = '';

  paisesUnicos: string[] = [];
  puertosUnicos: string[] = [];

  paisesSeleccionados: string[] = [];
  puertosSeleccionados: string[] = [];

  isLoadingReporte: boolean = false;

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

  constructor(private reportesService: ReportesCustomService, private toastController: ToastController, private loadingController: LoadingController) { }

  ngOnInit() {
    this.cargarTodasLasEmbarcaciones();
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

  cargarTodasLasEmbarcaciones() {
    this.reportesService.getAllEmbarcaciones().subscribe({
      next: (data: any[]) => {
        this.embarcacionesTodas = data;
        console.log('Datos de embarcacionesTodas al iniciar la vista:', this.embarcacionesTodas);

        this.paisesUnicos = Array.from(
          new Set<string>(
            data.map((e: any) => this.getPaisPorPuerto(e.destino_embarcacion) || 'NO DISPONIBLE').filter((p: string) => !!p)
          )
        ).sort();

        this.puertosUnicos = Array.from(
          new Set<string>(
            data.map((e: any) => e.destino_embarcacion || 'NO DISPONIBLE').filter((p: string) => !!p)
          )
        ).sort();

        this.paisesSeleccionados = ['ALL'];
        this.puertosSeleccionados = ['ALL'];

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
    });
    await loading.present();
    return loading;
  }

  async dismissLoading(loading: any) {
    this.isLoadingReporte = false;
    await loading.dismiss();
  }

  filtrarTodo() {
    this.embarcacionesFiltradas = this.embarcacionesTodas.filter((e: any) => {
      if (!e.fecha_arribo || e.fecha_arribo === 'N/A') return false;
      const fechaArribo = new Date(e.fecha_arribo);
      if (this.fechaDesdeISO) {
        const desde = new Date(this.fechaDesdeISO);
        if (fechaArribo < desde) return false;
      }
      if (this.fechaHastaISO) {
        const hasta = new Date(this.fechaHastaISO);
        hasta.setHours(23, 59, 59, 999);
        if (fechaArribo > hasta) return false;
      }
      const pais: string = this.getPaisPorPuerto(e.destino_embarcacion) || e.pais_embarcacion || 'NO DISPONIBLE';
      const puerto: string = e.destino_embarcacion || 'NO DISPONIBLE';
      const allPaises = this.paisesSeleccionados.includes('ALL');
      const allPuertos = this.puertosSeleccionados.includes('ALL');
      const filtraPorPais = !allPaises && this.paisesSeleccionados.length > 0;
      const filtraPorPuerto = !allPuertos && this.puertosSeleccionados.length > 0;
      if (filtraPorPais && filtraPorPuerto) {
        return (
          this.paisesSeleccionados.includes(pais) &&
          this.puertosSeleccionados.includes(puerto)
        );
      } else if (filtraPorPais) {
        return this.paisesSeleccionados.includes(pais);
      } else if (filtraPorPuerto) {
        return this.puertosSeleccionados.includes(puerto);
      }
      return true;
    });
    this.totalVessels = this.embarcacionesFiltradas.length;
  }

  limpiarFiltros() {
    this.fechaDesdeStr = '';
    this.fechaHastaStr = '';
    this.fechaDesdeISO = null;
    this.fechaHastaISO = null;
    this.formatoReporte = '';
    this.paisesSeleccionados = ['ALL'];
    this.puertosSeleccionados = ['ALL'];
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
    this.actualizarPuertosPorPais(); // <-- NUEVO: actualiza puertos según país
    this.filtrarTodo();
  }

  actualizarPuertosPorPais() {
    // Si está seleccionado 'ALL', mostrar todos los puertos
    if (this.paisesSeleccionados.includes('ALL') || this.paisesSeleccionados.length === 0) {
      this.puertosUnicos = Array.from(
        new Set<string>(
          this.embarcacionesTodas.map((e: any) => e.destino_embarcacion || 'NO DISPONIBLE').filter((p: string) => !!p)
        )
      ).sort();
      this.puertosSeleccionados = ['ALL'];
      return;
    }
    // Si hay países seleccionados, mostrar solo los puertos ligados a esos países según el diccionario y los datos existentes
    const paisesNormalizados = this.paisesSeleccionados.map(p => p.trim().toUpperCase());
    const puertosFiltrados = this.embarcacionesTodas
      .filter((e: any) => {
        // Determinar país del puerto usando el diccionario si es posible
        const puerto = (e.destino_embarcacion || '').trim().toUpperCase();
        const paisDiccionario = this.PUERTOS_PAISES[puerto] ? this.PUERTOS_PAISES[puerto].trim().toUpperCase() : '';
        // También considerar el campo pais_embarcacion si existe
        const paisEmbarcacion = (e.pais_embarcacion || '').trim().toUpperCase();
        // El puerto es válido si el país coincide por diccionario o por campo
        return paisesNormalizados.includes(paisDiccionario) || paisesNormalizados.includes(paisEmbarcacion);
      })
      .map((e: any) => e.destino_embarcacion || 'NO DISPONIBLE');
    this.puertosUnicos = Array.from(new Set<string>(puertosFiltrados)).sort();
    // Si algún puerto seleccionado ya no está disponible, lo quitamos
    this.puertosSeleccionados = this.puertosSeleccionados.filter(p => this.puertosUnicos.includes(p));
    // Si no queda ninguno seleccionado, seleccionamos 'ALL' por defecto
    if (this.puertosSeleccionados.length === 0) {
      this.puertosSeleccionados = ['ALL'];
    }
  }

  isAllPaisesSelected(): boolean {
    return this.paisesSeleccionados.includes('ALL');
  }

  togglePuerto(puerto: string) {
    if (this.puertosSeleccionados.includes('ALL')) {
      this.puertosSeleccionados = [];
    }
    if (this.puertosSeleccionados.includes(puerto)) {
      this.puertosSeleccionados = this.puertosSeleccionados.filter((p: string) => p !== puerto);
    } else {
      this.puertosSeleccionados.push(puerto);
    }
    this.filtrarTodo();
  }

  isAllPuertosSelected(): boolean {
    return this.puertosSeleccionados.includes('ALL');
  }

  async generarReporte() {
    // Validaciones de filtros obligatorios
    if (!this.formatoReporte) {
      this.presentToast('Debes seleccionar el formato de reporte (Excel o PDF).', 'warning');
      return;
    }
    if (this.isAllPaisesSelected() || this.paisesSeleccionados.length === 0) {
      this.presentToast('Debes seleccionar al menos un país.', 'warning');
      return;
    }
    if (this.isAllPuertosSelected() || this.puertosSeleccionados.length === 0) {
      this.presentToast('Debes seleccionar al menos un puerto.', 'warning');
      return;
    }
    if (!this.fechaDesdeISO || !this.fechaHastaISO) {
      this.presentToast('Debes seleccionar ambas fechas (desde y hasta).', 'warning');
      return;
    }
    // Validar si hay datos filtrados antes de mostrar animación
    if (!this.embarcacionesFiltradas || this.embarcacionesFiltradas.length === 0) {
      this.presentToast('No hay datos para exportar en el rango de fechas seleccionado.', 'warning');
      return;
    }
    const loading = await this.presentLoading('Generando reporte...');
    try {
      if (this.formatoReporte === 'excel') {
        this.generarExcel();
      } else if (this.formatoReporte === 'pdf') {
        this.generarPDFHorizontal();
      }
      this.presentToast('Reporte descargado', 'success');
    } catch (error) {
      this.presentToast('Error al generar el reporte', 'danger');
    } finally {
      this.dismissLoading(loading);
    }
  }

  generarExcel() {
    if (this.embarcacionesFiltradas.length === 0) {
      alert('No hay datos para exportar a Excel.');
      return;
    }
    const rows: any[][] = [];
    rows.push(['VESSELS BY COUNTRY REPORT']);
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
    rows.push([]);
    rows.push(['COUNTRY:', this.paisesSeleccionados.join(', ')]);
    rows.push(['PORT:', this.puertosSeleccionados.join(', ')]);
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
        e.clientes?.[0]?.cliente_id?.nombre_cliente || 'NO DISPONIBLE'
      ]);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(rows);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vessels By Country');
    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array'
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, 'Vessels_By_Country_Report.xlsx');
    console.log('Excel generado correctamente.');
  }

  generarPDFHorizontal() {
    if (this.embarcacionesFiltradas.length === 0) {
      alert('No hay datos para exportar a PDF.');
      return;
    }
    console.log('Datos de embarcacionesFiltradas:', this.embarcacionesFiltradas);
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
        { text: e.pais_embarcacion || '', style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' },
        { text: e.fecha_arribo ? this.formatDate(e.fecha_arribo) : 'N/A', style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' },
        { text: e.fecha_zarpe ? this.formatDate(e.fecha_zarpe) : 'N/A', style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' },
        { text: e.nombre_empresa_cliente || 'NO DISPONIBLE', style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' }
      ]),
      [
        { text: 'TOTAL DE REGISTROS', colSpan: 7, alignment: 'right', style: 'boldTextPDF', border: [false, true, false, false] }, {}, {}, {}, {}, {}, {},
        { text: String(this.embarcacionesFiltradas.length), style: 'boldTextPDF', alignment: 'center', border: [false, true, false, false] }
      ]
    ];
    const docDefinition: any = {
      pageOrientation: 'landscape',
      content: [
        { text: 'VESSELS BY COUNTRY REPORT', style: 'headerPDF' },
        {
          columns: [
            { text: `FROM: ${this.fechaDesdeStr || '---'}`, style: 'subheaderPDF' },
            { text: `TO: ${this.fechaHastaStr || '---'}`, alignment: 'right', style: 'subheaderPDF' }
          ]
        },
        { text: `TOTAL VESSELS: ${this.totalVessels}`, margin: [0, 10, 0, 10], style: 'boldTextPDF' },
        { text: `COUNTRY: ${this.paisesSeleccionados.join(', ')}`, style: 'boldTextPDF' },
        { text: `PORT: ${this.puertosSeleccionados.join(', ')}`, style: 'boldTextPDF' },
        { text: 'DETAILS:', style: 'boldTextPDF' },
        {
          table: {
            headerRows: 1,
            widths: [30, 50, 100, 100, 100, 80, 80, 150],
            body: detailsTable
          },
          layout: {
            fillColor: (rowIndex: number) => {
              if (rowIndex === 0) return '#14345C'; // header azul marino
              return rowIndex % 2 === 0 ? '#f2f6fa' : '#ffffff'; // filas alternas gris claro
            },
            hLineColor: () => '#14345C',
            vLineColor: () => '#14345C',
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            paddingLeft: () => 4,
            paddingRight: () => 4,
            paddingTop: () => 2,
            paddingBottom: () => 2,
          }
        }
      ],
      styles: {
        headerPDF: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
          color: '#14345C'
        },
        subheaderPDF: {
          fontSize: 12,
          bold: true,
          color: '#14345C'
        },
        boldTextPDF: {
          fontSize: 12,
          bold: true,
          color: '#14345C'
        },
        tableHeaderPDF: {
          bold: true,
          fontSize: 11,
          color: '#fff',
          fillColor: '#14345C'
        },
        tableCellEvenPDF: {
          fontSize: 10,
          color: '#222',
          fillColor: '#f2f6fa'
        },
        tableCellOddPDF: {
          fontSize: 10,
          color: '#222',
          fillColor: '#fff'
        }
      }
    };
    pdfMake.createPdf(docDefinition).download('Vessels_By_Country_Report.pdf');
  }

  formatDate(dateISO: string): string {
    const d = new Date(dateISO);
    if (isNaN(d.getTime())) return '';
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
