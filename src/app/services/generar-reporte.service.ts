import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenerarReporteService {

  private apiUrl=`${environment.apiUrl}/reportes`;
  constructor(private http:HttpClient) { }

  obtenerReporte(clienteId: string, fechaInicio: string, fechaFin: string): Observable<Blob> {
    const params = new HttpParams()
      .set('fecha_inicio', fechaInicio)
      .set('fecha_fin', fechaFin);
  
    return this.http.get(`${this.apiUrl}/pdf/${clienteId}`, {
      params,
      responseType: 'blob' // Importante para manejar el PDF
    });
  }

}

