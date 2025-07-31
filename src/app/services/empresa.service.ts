import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = 'http://localhost:5000/api/empresa-cliente';

  constructor(private http: HttpClient) {}

  crearEmpresa(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  obtenerEmpresas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  eliminarEmpresa(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  actualizarEmpresa(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  /**
   * ✅ Obtiene todos los clientes empresa
   * @returns Observable con array de empresas cliente
   */
  getClientesEmpresa(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
