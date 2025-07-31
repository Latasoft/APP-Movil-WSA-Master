import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SolicitudReporte } from '../models/solictud_reporte';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudReporteService {

  private apiUrl=`${environment.apiUrl}/solicitud-reportes`;
  constructor(private htt:HttpClient) { }

  crearSolicitudReporte(solicitudReporte:SolicitudReporte):Observable<SolicitudReporte>{
    return this.htt.post<SolicitudReporte>(`${this.apiUrl}`,solicitudReporte);
  }
  getSolicitudReporte(id:string){
    return this.htt.get(`${this.apiUrl}/${id}`);
  }
  getSolicitudesReportes(){
    return this.htt.get(`${this.apiUrl}`);
  }
  getSolicitudesReportesById(id:string){
    return this.htt.get(`${this.apiUrl}/usuario/${id}`);
  }
  updateSolicitudReporte(id:string,solicitudReporte:SolicitudReporte):Observable<SolicitudReporte>{
    return this.htt.put<SolicitudReporte>(`${this.apiUrl}/${id}`,solicitudReporte);
  }
}
