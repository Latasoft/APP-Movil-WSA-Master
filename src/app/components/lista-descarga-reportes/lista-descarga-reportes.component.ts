import { Component, OnInit } from '@angular/core';
import { DescargaReporteUser } from 'src/app/models/registro_descarga_reporte';
import { RegistroReporteService } from 'src/app/services/registro-reporte.service';
import {IonHeader,IonTitle,IonToolbar,IonContent,IonList,IonItem,IonLabel,IonSpinner,
  IonBackButton,IonButtons
} from '@ionic/angular/standalone'
import { CommonModule } from '@angular/common';
import { FooterNavegacionComponent } from '../footer-navegacion/footer-navegacion.component';
@Component({
  selector: 'app-lista-descarga-reportes',
  templateUrl: './lista-descarga-reportes.component.html',
  styleUrls: ['./lista-descarga-reportes.component.scss'],
  imports:[IonHeader,IonTitle,IonToolbar,IonContent,IonList,IonItem,IonLabel,CommonModule,
    IonSpinner,IonBackButton,IonButtons,FooterNavegacionComponent
  ],
})
export class ListaDescargaReportesComponent  implements OnInit {

  solicitudes: DescargaReporteUser[] = []; // Lista donde guardamos las solicitudes
  isLoading: boolean = false
  totalSolicitudes = 0;
  currentPage = 1;
  limit = 10;
  constructor(private descargaReporteService:RegistroReporteService) { }

  ngOnInit() {
    this.obtenerSolicitudes(); // Llamamos al método para obtener las solicitudes al iniciar el componente
  }

  obtenerSolicitudes() {
    this.isLoading = true;
    this.descargaReporteService.getAllRegistroReportesDescargas(this.currentPage,this.limit).subscribe({
      next: (response) => {
        this.solicitudes = response.solicitud;
        console.log(this.solicitudes);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar las solicitudes', error);
        this.isLoading = false;
      }
    });
  }
  cambiarPagina(nuevaPagina: number) {
    this.currentPage = nuevaPagina;
    this.obtenerSolicitudes();
  }

  
}
