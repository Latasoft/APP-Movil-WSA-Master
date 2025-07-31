import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';


import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
  IonLoading,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonTitle,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonFooter,
  IonIcon
} from '@ionic/angular/standalone';

import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { GenerarReporteService } from 'src/app/services/generar-reporte.service';

// Importar solo el plugin de Capacitor
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { RegistroReporteService } from 'src/app/services/registro-reporte.service';
import { RegistroSolicutudReporte } from 'src/app/models/registro_descarga_reporte';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-generar-reporte',
  templateUrl: './generar-reporte.page.html',
  styleUrls: ['./generar-reporte.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonItem,
    IonTitle,
    IonLabel,
    IonInput,
    IonButton,
    IonList,
    IonLoading,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonFooter,
    IonIcon
  ]
})
export class GenerarReportePage implements OnInit {
  clientes: Cliente[] = [];
  fechaInicio: string = '';
  fechaFin: string = '';
  isLoading = false;
  userId: string = ''; // ID del usuario logueado

  isLoadingClientes = false; // Indicador para carga de clientes
  isGeneratingReport = false; // Indicador para generación de reportes

  constructor(
    private clienteService: ClienteService,
    private reporteService: GenerarReporteService,
    private toastController: ToastController,
    private RegistroDescargaService: RegistroReporteService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userId = this.getUserId() ?? '';
    this.loadClientes();
  }
  goToTotalVesselsReports() {
  this.router.navigate(['/total-vessels-reports']);
}
goToVesselsByCountry() {
    this.router.navigate(['/vessels-by-country']);
  }
  goToCustom() {
    this.router.navigate(['/vessels-by-customer']);
  }
  goToVesselsReports() {
    this.router.navigate(['/vessels-reports']);
  }
  goToVesselsByServices() {
    this.router.navigate(['/vessels-by-services']);
  }
  goToVesselsByOperator() {
    this.router.navigate(['/vessels-by-operator']);
  }

  getUserId() {
    return this.authService.getIdFromToken();
  }

  private loadClientes() {
    this.isLoadingClientes = true;

    this.clienteService.getAllClientesPaginados().subscribe({
      next: (response) => {
        this.clientes = response.clientes;
        this.isLoadingClientes = false;
      },
      error: (err) => {
        this.isLoadingClientes = false;
        if (err.status === 404) {
          this.presentToast(err.error.message || 'No hay datos para ese cliente en esas fechas.', 'danger');
        } else {
          this.presentToast('Error al generar el reporte. Intenta nuevamente.', 'danger');
        }
      }
    });
  }

  private async presentToast(
    message: string,
    color: 'primary' | 'success' | 'warning' | 'danger' = 'success'
  ) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await toast.present();
  }

  descargarPDF(clienteId: string) {
    if (!clienteId || !this.fechaInicio || !this.fechaFin) {
      this.presentToast('Selecciona el rango de fechas.', 'warning');
      return;
    }

    this.isGeneratingReport = true;

    this.reporteService.obtenerReporte(clienteId, this.fechaInicio, this.fechaFin).subscribe({
      next: async (pdfBlob) => {
        const nombreArchivo = `reporte-${clienteId}.pdf`;

        if (Capacitor.getPlatform() === 'web') {
          const dataForRegistro: RegistroSolicutudReporte = {
            id_solicitante: this.userId,
            rango_fecha_inicio: new Date(this.fechaInicio),
            rango_fecha_termino: new Date(this.fechaFin)
          };

          console.log('Registro de descarga:', dataForRegistro);
          this.RegistroDescargaService.crearRegistroReporte(dataForRegistro).subscribe(
            (response) => {
              console.log('Registro de descarga creado:', response);
            },
            (error) => {
              console.error('Error al crear el registro de descarga:', error);
            }
          );

          // Web: descarga normal
          const link = document.createElement('a');
          link.href = URL.createObjectURL(pdfBlob);
          link.download = nombreArchivo;
          link.click();
        } else {
          // APK: guardar y abrir
          try {
            const base64 = await this.blobToBase64(pdfBlob);

            const writtenFile = await Filesystem.writeFile({
              path: nombreArchivo,
              data: base64,
              directory: Directory.Documents
            });

            const dataForRegistro: RegistroSolicutudReporte = {
              id_solicitante: this.userId,
              rango_fecha_inicio: new Date(this.fechaInicio),
              rango_fecha_termino: new Date(this.fechaFin)
            };

            this.RegistroDescargaService.crearRegistroReporte(dataForRegistro).subscribe(
              (response) => {
                console.log('Registro de descarga creado:', response);
              },
              (error) => {
                console.error('Error al crear el registro de descarga:', error);
              }
            );

            // Obtener URI del archivo
            const uriResult = await Filesystem.getUri({
              directory: Directory.Documents,
              path: nombreArchivo
            });

            await FileOpener.open({
              filePath: uriResult.uri,
              contentType: 'application/pdf'
            });

            this.presentToast('Reporte descargado correctamente', 'success');
          } catch (err) {
            console.error('❌ Error al abrir el archivo PDF', err);
            this.presentToast('No se pudo abrir el PDF: ' + JSON.stringify(err), 'danger');
          }
        }

        this.isGeneratingReport = false;
      },
      error: (err) => {
        this.isGeneratingReport = false;
        if (err.status === 404) {
          this.presentToast(err.error.message || 'No hay datos para ese cliente en esas fechas.', 'danger');
        } else {
          this.presentToast('Error al generar el reporte.', 'danger');
        }
      }
    });
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  }
}
