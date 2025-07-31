import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonLabel,
  IonInput,
  IonList,
  IonItem,
  IonCheckbox,
  IonFooter,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ReportesCustomService } from 'src/app/services/reportes-custom.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-vessels-by-operator',
  templateUrl: './vessels-by-operator.page.html',
  styleUrls: ['./vessels-by-operator.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardContent,
    IonLabel,
    IonInput,
    IonList,
    IonItem,
    IonCheckbox,
    IonFooter,
    IonSelect,
    IonSelectOption,
    CommonModule,
    FormsModule
  ]
})
export class VesselsByOperatorPage implements OnInit {
  embarcacionesTodas: any[] = [];
  operadoresUnicos: string[] = [];
  operadoresSeleccionados: string[] = [];
  fechaDesdeStr: string = '';
  fechaHastaStr: string = '';
  fechaDesdeISO: string | null = null;
  fechaHastaISO: string | null = null;
  formatoReporte: string = '';

  constructor(private router: Router, private reportesService: ReportesCustomService) { }

  ngOnInit() {
    this.cargarTodasLasEmbarcaciones();
  }

  cargarTodasLasEmbarcaciones() {
    this.reportesService.getAllEmbarcaciones().subscribe({
      next: (data: any[]) => {
        this.embarcacionesTodas = data;
        console.log('Embarcaciones recibidas:', data);
        // Extraer operadores únicos desde trabajadores (username)
        const operadoresSet = new Set<string>();
        data.forEach(e => {
          if (Array.isArray(e.trabajadores)) {
            e.trabajadores.forEach((trab: any) => {
              if (trab.username) {
                operadoresSet.add(trab.username);
              }
            });
          }
        });
        this.operadoresUnicos = Array.from(operadoresSet).sort();
        this.operadoresSeleccionados = ['ALL'];
      },
      error: (err) => console.error(err)
    });
  }

  irAReportes() {
    this.router.navigate(['/vessels-reports']);
  }

  limpiarFiltros() {
    this.fechaDesdeStr = '';
    this.fechaHastaStr = '';
    this.fechaDesdeISO = null;
    this.fechaHastaISO = null;
    this.operadoresSeleccionados = ['ALL'];
    this.formatoReporte = '';
    // Aquí podrías volver a cargar todas las embarcaciones si lo deseas
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

  generarPDFHorizontal() {
    // Filtrar embarcaciones por operador seleccionado
    const operador = this.operadoresSeleccionados.find(o => o !== 'ALL');
    if (!operador) {
      alert('Debes seleccionar un operador.');
      return;
    }
    const embarcacionesFiltradas = this.embarcacionesTodas.filter(e =>
      Array.isArray(e.trabajadores) && e.trabajadores.some((trab: any) => trab.username === operador)
    );
    if (embarcacionesFiltradas.length === 0) {
      alert('No hay datos para exportar a PDF.');
      return;
    }
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
      ...embarcacionesFiltradas.map((e: any, idx: number) => [
        { text: (idx + 1).toString(), style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' },
        { text: e.da_numero || '', style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' },
        { text: e.titulo_embarcacion || '', style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' },
        { text: e.destino_embarcacion || '', style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' },
        { text: e.pais_embarcacion || 'NO DISPONIBLE', style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' },
        { text: this.formatDate(e.fecha_arribo), style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' },
        { text: this.formatDate(e.fecha_zarpe), style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' },
        { text: e.nombre_empresa_cliente || 'NO DISPONIBLE', style: idx % 2 === 0 ? 'tableCellEvenPDF' : 'tableCellOddPDF' } // CUSTOMER
      ]),
      [
        { text: '', colSpan: 8, style: 'tableHeaderPDF' }, '', '', '', '', '', '', ''
      ]
    ];
    const docDefinition: any = {
      pageOrientation: 'landscape',
      content: [
        { text: "VESSELS BY OPERATOR REPORT", style: 'headerPDF' },
        { text: `FROM: ${this.fechaDesdeStr || '---'}   TO: ${this.fechaHastaStr || '---'}` },
        { text: `TOTAL VESSELS: ${embarcacionesFiltradas.length}` },
        { text: `OPERATOR: ${operador}` },
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
    // @ts-ignore
    pdfMake.createPdf(docDefinition).open();
  }

  generarExcel() {
    const operador = this.operadoresSeleccionados.find(o => o !== 'ALL');
    if (!operador) {
      alert('Debes seleccionar un operador.');
      return;
    }
    const embarcacionesFiltradas = this.embarcacionesTodas.filter(e =>
      Array.isArray(e.trabajadores) && e.trabajadores.some((trab: any) => trab.username === operador)
    );
    if (embarcacionesFiltradas.length === 0) {
      alert('No hay datos para exportar a Excel.');
      return;
    }
    const rows: any[][] = [];
    rows.push(["TOTAL VESSEL'S BY OPERATOR"]);
    rows.push([]);
    rows.push([
      'FROM:',
      this.fechaDesdeStr || '---',
      '',
      'TO:',
      this.fechaHastaStr || '---'
    ]);
    rows.push([]);
    rows.push(['TOTAL VESSELS:', embarcacionesFiltradas.length]);
    rows.push(['OPERATOR:', operador]);
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
    embarcacionesFiltradas.forEach((e: any) => {
      rows.push([
        e.da_numero || '',
        e.titulo_embarcacion || '',
        e.destino_embarcacion || '',
        e.pais_embarcacion || 'NO DISPONIBLE',
        this.formatDate(e.fecha_arribo),
        this.formatDate(e.fecha_zarpe),
        e.nombre_empresa_cliente || 'NO DISPONIBLE' // CUSTOMER
      ]);
    });
    // @ts-ignore
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(rows);
    // @ts-ignore
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // @ts-ignore
    XLSX.utils.book_append_sheet(wb, ws, 'Vessels By Operator');
    // @ts-ignore
    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array'
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    // @ts-ignore
    saveAs(blob, 'Vessels_By_Operator_Report.xlsx');
    console.log('Excel generado correctamente.');
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

  seleccionarOperador(operador: string) {
    this.operadoresSeleccionados = [operador];
  }

  get totalVesselsFiltrados(): number {
    const operador = this.operadoresSeleccionados.find(o => o !== 'ALL');
    if (!operador) return 0;
    return this.embarcacionesTodas.filter(e =>
      Array.isArray(e.trabajadores) && e.trabajadores.some((trab: any) => trab.username === operador)
    ).length;
  }
}
