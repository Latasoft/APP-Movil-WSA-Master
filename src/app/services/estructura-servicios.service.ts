import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstructuraServiciosService {

  private apiUrl = `${environment.apiUrl}/estructura-servicios`;

  constructor(private http: HttpClient) {}

  // ✅ Cargar estructura con token
  obtenerEstructura() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(this.apiUrl, { headers });
  }

  // ✅ Eliminar servicio relacionado por ID con token
  eliminarServicioRelacionadoPorId(principal: string, subservicio: string, idServicio: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch(`${this.apiUrl}/eliminar-servicio-relacionado-por-id`, {
      principal,
      subservicio,
      idServicio
    }, { headers });
  }

  // ✅ Agregar servicio relacionado con token
  agregarServicioRelacionado(principal: string, subservicio: string, nuevoServicio: { nombre: string }) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const url = `${this.apiUrl}/agregar-servicio-relacionado/${encodeURIComponent(principal)}/${encodeURIComponent(subservicio)}`;
    return this.http.patch(url, nuevoServicio, { headers });
  }

  // ✅ Editar servicio relacionado con token
  editarServicioRelacionado(principal: string, subservicio: string, nombreAntiguo: string, nombreNuevo: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch(`${this.apiUrl}/editar-servicio-relacionado`, {
      principal,
      subservicio,
      nombreAntiguo,
      nombreNuevo
    }, { headers });
  }

  // ✅ Eliminar subservicio con token
  eliminarSubservicio(principal: string, subservicio: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const url = `${this.apiUrl}/eliminar-subservicio/${encodeURIComponent(principal)}`;
    return this.http.patch(url, { subservicio }, { headers });
  }
}
