import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonLabel,
  IonIcon,
  IonInput,
  IonList,
  IonItem,
  IonCheckbox,
  IonButton,
  IonFooter,
  IonSelect,
  IonSelectOption,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';
import { ReportesCustomService } from 'src/app/services/reportes-custom.service';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-vessels-reports',
  templateUrl: './vessels-reports.page.html',
  styleUrls: ['./vessels-reports.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardContent,
    IonLabel,
    IonIcon,
    IonInput,
    IonList,
    IonItem,
    IonCheckbox,
    IonButton,
    IonFooter,
    IonSelect,
    IonSelectOption
  ],
  providers: [ToastController, LoadingController]
})
export class VesselsReportsPage implements OnInit {
  fechaDesdeStr: string = '';
  fechaHastaStr: string = '';
  embarcacionesTodas: any[] = [];
  embarcacionesFiltradas: any[] = [];
  totalVessels: number = 0;
  vesselsUnicos: string[] = [];
  vesselsSeleccionados: string[] = [];
  daNumeroSeleccionado: string = '';
  puertosUnicos: string[] = [];
  puertosSeleccionados: string[] = [];
  formatoReporte: string = '';
  isLoadingReporte: boolean = false;
  mensajeNoResultados: string = '';

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

  constructor(
    private reportesService: ReportesCustomService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

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

  // Devuelve un string 'DD-MM-YYYY' como 'YYYY-MM-DD' para el constructor Date
  parseDateString(dateStr: string): string | null {
    if (!dateStr) return null;
    const partes = dateStr.split('-');
    if (partes.length === 3) {
      const [day, month, year] = partes;
      return `${year}-${month}-${day}`;
    }
    return null;
  }

  // Normaliza un string de fecha a 'YYYY-MM-DD' (ignora la hora)
  toYYYYMMDD(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  cargarTodasLasEmbarcaciones() {
    this.reportesService.getAllEmbarcaciones().subscribe({
      next: (data: any[]) => {
        this.embarcacionesTodas = data;
        this.vesselsUnicos = Array.from(new Set(data.map(e => e.titulo_embarcacion || 'NO DISPONIBLE'))).sort();
        this.puertosUnicos = Array.from(new Set(data.map(e => e.destino_embarcacion || 'NO DISPONIBLE'))).sort();
        this.vesselsSeleccionados = ['ALL'];
        this.puertosSeleccionados = ['ALL'];
        this.filtrarTodo();
      },
      error: (err) => console.error(err)
    });
  }

  async presentToast(message: string, color: 'primary' | 'success' | 'warning' | 'danger' = 'warning') {
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
      cssClass: 'custom-yellow-loading'
    });
    await loading.present();
    return loading;
  }

  async dismissLoading(loading: any) {
    this.isLoadingReporte = false;
    await loading.dismiss();
  }

  filtrarTodo() {
    this.mensajeNoResultados = '';
    if (this.daNumeroSeleccionado) {
      // Buscar embarcación por DA N° exacto
      const embarcacion = this.embarcacionesTodas.find((e: any) => String(e.da_numero) === this.daNumeroSeleccionado);
      if (embarcacion) {
        this.embarcacionesFiltradas = [embarcacion];
        this.totalVessels = 1;
        // Solo mostrar la embarcación encontrada
        this.vesselsUnicos = [embarcacion.titulo_embarcacion || 'NO DISPONIBLE'];
        this.vesselsSeleccionados = [embarcacion.titulo_embarcacion || 'NO DISPONIBLE'];
        // Solo mostrar el puerto correspondiente
        this.puertosUnicos = [embarcacion.destino_embarcacion || 'NO DISPONIBLE'];
        this.puertosSeleccionados = [embarcacion.destino_embarcacion || 'NO DISPONIBLE'];
      } else {
        this.embarcacionesFiltradas = [];
        this.totalVessels = 0;
        this.vesselsUnicos = [];
        this.vesselsSeleccionados = [];
        this.puertosUnicos = [];
        this.puertosSeleccionados = [];
        this.mensajeNoResultados = 'No se encontró ninguna embarcación con ese DA N°.';
      }
      return;
    }
    this.embarcacionesFiltradas = this.embarcacionesTodas.filter((e: any) => {
      // Fechas
      if (this.fechaDesdeStr) {
        const desdeStr = this.parseDateString(this.fechaDesdeStr);
        if (!desdeStr) return false;
        const desde = new Date(desdeStr);
        const fechaArribo = e.fecha_arribo ? new Date(e.fecha_arribo) : null;
        if (!fechaArribo || isNaN(fechaArribo.getTime())) return false;
        if (this.toYYYYMMDD(fechaArribo) < this.toYYYYMMDD(desde)) return false;
      }
      if (this.fechaHastaStr) {
        const hastaStr = this.parseDateString(this.fechaHastaStr);
        if (!hastaStr) return false;
        const hasta = new Date(hastaStr);
        const fechaArribo = e.fecha_arribo ? new Date(e.fecha_arribo) : null;
        if (!fechaArribo || isNaN(fechaArribo.getTime())) return false;
        if (this.toYYYYMMDD(fechaArribo) > this.toYYYYMMDD(hasta)) return false;
      }
      // Vessel
      const vessel = e.titulo_embarcacion || 'NO DISPONIBLE';
      const allVessels = this.vesselsSeleccionados.includes('ALL');
      if (!allVessels && this.vesselsSeleccionados.length > 0 && !this.vesselsSeleccionados.includes(vessel)) return false;
      // Puerto
      const puerto = e.destino_embarcacion || 'NO DISPONIBLE';
      const allPuertos = this.puertosSeleccionados.includes('ALL');
      if (!allPuertos && this.puertosSeleccionados.length > 0 && !this.puertosSeleccionados.includes(puerto)) return false;
      return true;
    });
    this.totalVessels = this.embarcacionesFiltradas.length;
    this.vesselsUnicos = Array.from(new Set(this.embarcacionesFiltradas.map(e => e.titulo_embarcacion || 'NO DISPONIBLE'))).sort();
    this.puertosUnicos = Array.from(new Set(this.embarcacionesFiltradas.map(e => e.destino_embarcacion || 'NO DISPONIBLE'))).sort();
    // Mostrar mensaje si no hay resultados
    if (this.embarcacionesFiltradas.length === 0) {
      this.mensajeNoResultados = 'No hay registros para los filtros seleccionados.';
    }
  }

  isAllVesselsSelected(): boolean {
    return this.vesselsSeleccionados.includes('ALL');
  }
  toggleAllVessels() {
    if (this.isAllVesselsSelected()) {
      this.vesselsSeleccionados = [];
    } else {
      this.vesselsSeleccionados = ['ALL'];
    }
    this.filtrarTodo();
  }
  toggleVessel(vessel: string) {
    if (this.vesselsSeleccionados.includes('ALL')) {
      this.vesselsSeleccionados = [];
    }
    if (this.vesselsSeleccionados.includes(vessel)) {
      this.vesselsSeleccionados = this.vesselsSeleccionados.filter(v => v !== vessel);
    } else {
      this.vesselsSeleccionados.push(vessel);
    }
    this.filtrarTodo();
  }
  isAllPuertosSelected(): boolean {
    return this.puertosSeleccionados.includes('ALL');
  }
  toggleAllPuertos() {
    if (this.isAllPuertosSelected()) {
      this.puertosSeleccionados = [];
    } else {
      this.puertosSeleccionados = ['ALL'];
    }
    this.filtrarTodo();
  }
  togglePuerto(puerto: string) {
    if (this.puertosSeleccionados.includes('ALL')) {
      this.puertosSeleccionados = [];
    }
    if (this.puertosSeleccionados.includes(puerto)) {
      this.puertosSeleccionados = this.puertosSeleccionados.filter(p => p !== puerto);
    } else {
      this.puertosSeleccionados.push(puerto);
    }
    this.filtrarTodo();
  }
  limpiarFiltros() {
    this.fechaDesdeStr = '';
    this.fechaHastaStr = '';
    this.vesselsSeleccionados = ['ALL'];
    this.daNumeroSeleccionado = '';
    this.puertosSeleccionados = ['ALL'];
    this.filtrarTodo();
  }

  async generarReporte() {
    if (!this.formatoReporte) {
      this.presentToast('Debes seleccionar el formato de reporte (Excel o PDF).', 'warning');
      return;
    }
    if (this.embarcacionesFiltradas.length === 0) {
      this.presentToast('No hay registros para exportar.', 'warning');
      return;
    }
    const loading = await this.presentLoading('Descargando...');
    setTimeout(async () => {
      if (this.formatoReporte === 'excel') {
        this.generarExcel();
      } else if (this.formatoReporte === 'pdf') {
        this.generarPDFHorizontal();
      }
      await this.dismissLoading(loading);
      this.presentToast('¡Reporte generado exitosamente!', 'success');
    }, 1200);
  }

  generarExcel() {
    if (this.embarcacionesFiltradas.length === 0) {
      alert('No hay datos para exportar a Excel.');
      return;
    }
    const rows: any[][] = [];
    rows.push(["TOTAL VESSEL'S REPORTS"]);
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
    rows.push(['COUNTRY:']);
    // Resumen de países
    const countries = Array.from(new Set(this.embarcacionesFiltradas.map(e => this.getPaisPorPuerto(e.destino_embarcacion) || 'NO DISPONIBLE')));
    rows.push(countries);
    rows.push(countries.map(c => this.embarcacionesFiltradas.filter(e => (this.getPaisPorPuerto(e.destino_embarcacion) || 'NO DISPONIBLE') === c).length));
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
    this.embarcacionesFiltradas.forEach(e => {
      rows.push([
        e.da_numero || '',
        e.titulo_embarcacion || '',
        e.destino_embarcacion || '',
        e.pais_embarcacion || 'NO DISPONIBLE',
        e.fecha_arribo ? this.formatDate(e.fecha_arribo) : 'N/A',
        e.fecha_zarpe ? this.formatDate(e.fecha_zarpe) : 'N/A',
        e.nombre_empresa_cliente || 'NO DISPONIBLE'
      ]);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(rows);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vessel's Reports");
    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array'
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, "Vessels_Reports.xlsx");
    alert('Excel generado correctamente.');
  }

  generarPDFHorizontal() {
    if (this.embarcacionesFiltradas.length === 0) {
      alert('No hay datos para exportar a PDF.');
      return;
    }
    // Resumen de países
    const countries = Array.from(new Set(this.embarcacionesFiltradas.map(e => this.getPaisPorPuerto(e.destino_embarcacion) || 'NO DISPONIBLE')));
    let countryTable: any[] = [];
    if (countries.length > 0) {
      countryTable.push(countries.map((c: string) => ({ text: c, bold: true })));
      countryTable.push(countries.map((c: string) => String(this.embarcacionesFiltradas.filter(e => (this.getPaisPorPuerto(e.destino_embarcacion) || 'NO DISPONIBLE') === c).length)));
    } else {
      countryTable.push([{ text: 'NO DATA', colSpan: countries.length || 1 }]);
    }
    // Tabla de detalles
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
        { text: 'TOTAL DE REGISTROS', colSpan: 7, alignment: 'right', style: 'boldTextPDF', border: [false, true, false, false] }, {}, {}, {}, {}, {}, {},
        { text: String(this.embarcacionesFiltradas.length), style: 'boldTextPDF', alignment: 'center', border: [false, true, false, false] }
      ]
    ];
    const docDefinition: any = {
      pageOrientation: 'landscape',
      content: [
        { text: "TOTAL VESSEL'S REPORTS", style: 'headerPDF' },
        {
          columns: [
            { text: `FROM: ${this.fechaDesdeStr || '---'}`, style: 'subheaderPDF' },
            { text: `TO: ${this.fechaHastaStr || '---'}`, alignment: 'right', style: 'subheaderPDF' }
          ]
        },
        { text: `TOTAL VESSELS: ${this.totalVessels}`, margin: [0, 10, 0, 10], style: 'boldTextPDF' },
        { text: 'COUNTRY:', style: 'boldTextPDF' },
        {
          table: {
            widths: countries.map(() => '*'),
            body: countryTable
          },
          margin: [0, 0, 0, 20]
        },
        { text: 'DETAILS:', style: 'boldTextPDF' },
        {
          table: {
            headerRows: 1,
            widths: [30, 50, 120, 120, 100, 100, 100, 150],
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
          },
          margin: [0, 0, 0, 20]
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
    pdfMake.createPdf(docDefinition).download('Vessels_Reports.pdf');
    alert('PDF generado correctamente.');
  }

  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
