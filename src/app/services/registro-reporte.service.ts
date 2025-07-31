import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RegistroDescargaResponse, RegistroSolicutudReporte } from '../models/registro_descarga_reporte';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroReporteService {
  private apiUrl=`${environment.apiUrl}/registro-descargas-reportes`;

  constructor(private http:HttpClient) { }

  crearRegistroReporte(solicitudReporte:RegistroSolicutudReporte):Observable<RegistroSolicutudReporte>{
    return this.http.post<RegistroSolicutudReporte>(`${this.apiUrl}`, solicitudReporte);
  }
  getAllRegistroReportesDescargas(page: number = 1, limit: number = 10):Observable<RegistroDescargaResponse>{
    return this.http.get<RegistroDescargaResponse>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }
}
