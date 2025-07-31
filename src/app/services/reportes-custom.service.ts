import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesCustomService {

  private baseUrl = `${environment.apiUrl}/reportes-customs/embarcaciones`;


  constructor(private http: HttpClient) { }

  /**
   * ✅ Traer todas las embarcaciones (detalle completo)
   */
  getAllEmbarcaciones(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  /**
   * ✅ Contar el total de embarcaciones
   */
  countEmbarcaciones(): Observable<any> {
    return this.http.get(`${this.baseUrl}/count`);
  }

  /**
   * ✅ Reporte de embarcaciones agrupadas por país
   */
  reportEmbarcacionesByCountry(): Observable<any> {
    return this.http.get(`${this.baseUrl}/report/by-country`);
  }

  /**
   * ✅ Obtener todos los servicios de la estructura de servicios
   */
  getEstructuraServicios(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/estructura-servicios`);
  }

  /**
   * Obtener embarcaciones con nombre de cliente ya mapeado
   */
  getEmbarcacionesConNombreCliente(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/embarcaciones`);
  }
}
