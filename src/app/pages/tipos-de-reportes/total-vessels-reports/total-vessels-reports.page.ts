import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReportesCustomService } from 'src/app/services/reportes-custom.service';

import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs;

@Component({
  selector: 'app-total-vessels-reports',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './total-vessels-reports.page.html',
  styleUrls: ['./total-vessels-reports.page.scss'],
})
export class TotalVesselsReportsPage implements OnInit {

  fechaDesdeStr: string = '';
  fechaHastaStr: string = '';
  fechaDesdeISO: string | null = null;
  fechaHastaISO: string | null = null;

  embarcacionesTodas: any[] = [];
  embarcacionesFiltradas: any[] = [];

  totalVessels: number = 0;
  formatoReporte: string = '';

  vesselsByCountry: any = {};

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
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.cargarTodasLasEmbarcaciones();
    this.cargarTotalVessels();
    this.cargarVesselsByCountry();
  }

  cargarTodasLasEmbarcaciones() {
    this.reportesService.getAllEmbarcaciones().subscribe({
      next: (data) => {
        this.embarcacionesTodas = data;
        this.filtrarPorFechas();
      },
      error: (err) => console.error(err)
    });
  }

  cargarTotalVessels() {
    this.reportesService.countEmbarcaciones().subscribe({
      next: (data) => {
        this.totalVessels = data.total_vessels;
      },
      error: (err) => console.error(err)
    });
  }

  cargarVesselsByCountry() {
    this.reportesService.reportEmbarcacionesByCountry().subscribe({
      next: (data) => {
        this.vesselsByCountry = data.by_country;
      },
      error: (err) => console.error(err)
    });
  }

  getCountriesKeys() {
    if (!this.vesselsByCountry || typeof this.vesselsByCountry !== 'object') {
      return [];
    }
    return Object.keys(this.vesselsByCountry);
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

  onInputFecha(event: any, campo: 'desde' | 'hasta') {
    let valor = event.target.value || '';
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

    this.filtrarPorFechas();
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

  filtrarPorFechas() {
    if (!this.fechaDesdeISO && !this.fechaHastaISO) {
      this.embarcacionesFiltradas = this.embarcacionesTodas;
    } else {
      this.embarcacionesFiltradas = this.embarcacionesTodas.filter(e => {
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

        return true;
      });
    }

    this.totalVessels = this.embarcacionesFiltradas.length;

    this.vesselsByCountry = {};
    this.embarcacionesFiltradas.forEach(e => {
      const pais = this.getPaisPorPuerto(e.destino_embarcacion) || 'NO DISPONIBLE';
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
    this.filtrarPorFechas();
  }

  async showAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: mensaje,
      buttons: ['OK'],
      cssClass: 'logout-alert-marino'
    });
    await alert.present();
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
    const loading = await this.loadingController.create({
      message,
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }

  async generarReporte() {
    if (!this.fechaDesdeStr || !this.fechaHastaStr) {
      this.presentToast('Debes ingresar ambas fechas (FROM y TO) para generar el reporte.', 'warning');
      return;
    }
    if (!this.formatoReporte) {
      this.presentToast('Debes seleccionar el formato de reporte (Excel o PDF).', 'warning');
      return;
    }
    if (this.embarcacionesFiltradas.length === 0) {
      this.presentToast('No hay embarcaciones en el rango de fechas seleccionado.', 'warning');
      return;
    }
    const loading = await this.presentLoading('Generando reporte...');
    setTimeout(async () => {
      if (this.formatoReporte === 'excel') {
        this.generarExcel();
      } else if (this.formatoReporte === 'pdf') {
        this.generarPDFHorizontal();
      }
      await loading.dismiss();
      this.presentToast('Reporte descargado con éxito.', 'success');
    }, 800);
  }

  generarExcel() {
    if (this.embarcacionesFiltradas.length === 0) {
      // Ya validado en generarReporte
      return;
    }

    const rows: any[][] = [];

    rows.push(['TOTAL VESSEL\'S REPORTS']);
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

    const countries = this.getCountriesKeys();
    if (countries.length > 0) {
      rows.push(countries);
      const counts = countries.map(c => this.vesselsByCountry[c]);
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

    this.embarcacionesFiltradas.forEach(e => {
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
    XLSX.utils.book_append_sheet(wb, ws, 'Total Vessels Report');

    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, 'Total_Vessels_Report.xlsx');
    console.log('Excel generado correctamente.');
  }

  generarPDFHorizontal() {
    if (this.embarcacionesFiltradas.length === 0) {
      // Ya validado en generarReporte
      return;
    }

    // Construir tabla de países:
    const countries = this.getCountriesKeys();
    let countryTable: any[] = [];

    if (countries.length > 0) {
      countryTable.push(
        [
          { text: 'País', style: 'tableHeaderPDF' },
          { text: 'Vessels', style: 'tableHeaderPDF' }
        ]
      );
      countries.forEach((c, idx) => {
        countryTable.push([
          { text: c, style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' },
          { text: String(this.vesselsByCountry[c]), style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' }
        ]);
      });
      // Fila total
      countryTable.push([
        { text: 'Total', style: 'tableTotalPDF' },
        { text: String(this.totalVessels), style: 'tableTotalPDF' }
      ]);
    } else {
      countryTable.push([{ text: 'NO DATA', colSpan: 2, style: 'tableHeaderPDF' }]);
    }

    // Construir tabla de detalles con contador y fila total
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
      ...this.embarcacionesFiltradas.map((e, idx) => [
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
        { text: 'Vessels por País:', style: 'boldTextPDF' },
        {
          table: {
            widths: ['*', '*'],
            body: countryTable
          },
          layout: {
            fillColor: (rowIndex: number) => {
              if (rowIndex === 0) return '#14345C'; // header
              if (rowIndex === countryTable.length - 1) return '#2a5298'; // total
              return rowIndex % 2 === 0 ? '#1e3c72' : '#14345C'; // alternar
            },
            hLineColor: () => '#fff',
            vLineColor: () => '#fff',
            hLineWidth: () => 1,
            vLineWidth: () => 1
          },
          margin: [0, 0, 0, 20]
        },
        { text: 'DETALLES:', style: 'boldTextPDF' },
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
        },
        tableTotalPDF: {
          fillColor: '#2a5298',
          color: '#fff',
          bold: true,
          fontSize: 12
        }
      }
    };
    pdfMake.createPdf(docDefinition).download('Total_Vessels_Report.pdf');
  }

  formatDate(dateISO: string): string {
    const d = new Date(dateISO);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
