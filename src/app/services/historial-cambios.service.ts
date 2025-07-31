import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { 
  HistorialCambio, 
  HistorialCambiosResponse, 
  FiltrosHistorial 
} from '../models/historial-cambios';

@Injectable({
  providedIn: 'root'
})
export class HistorialCambiosService {
  private apiUrl = `${environment.apiUrl}/historial-cambios`;

  constructor(private http: HttpClient) { }

  /**
   * Registra un cambio en el historial
   */
  registrarCambio(cambio: HistorialCambio): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, cambio, { headers });
  }

  /**
   * Obtiene el historial de cambios con filtros
   */
  obtenerHistorial(filtros: FiltrosHistorial = {}): Observable<HistorialCambiosResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    
    if (filtros.usuario_id) params = params.set('usuario_id', filtros.usuario_id);
    if (filtros.entidad_tipo) params = params.set('entidad_tipo', filtros.entidad_tipo);
    if (filtros.entidad_id) params = params.set('entidad_id', filtros.entidad_id);
    if (filtros.accion) params = params.set('accion', filtros.accion);
    if (filtros.fecha_inicio) params = params.set('fecha_inicio', filtros.fecha_inicio.toISOString());
    if (filtros.fecha_fin) params = params.set('fecha_fin', filtros.fecha_fin.toISOString());
    if (filtros.page) params = params.set('page', filtros.page.toString());
    if (filtros.limit) params = params.set('limit', filtros.limit.toString());

    return this.http.get<HistorialCambiosResponse>(this.apiUrl, { headers, params });
  }

  /**
   * Obtiene el historial de una entidad específica
   */
  obtenerHistorialEntidad(entidadTipo: string, entidadId: string, page: number = 1, limit: number = 10): Observable<HistorialCambiosResponse> {
    return this.obtenerHistorial({
      entidad_tipo: entidadTipo,
      entidad_id: entidadId,
      page,
      limit
    });
  }

  /**
   * Obtiene el historial de un usuario específico
   */
  obtenerHistorialUsuario(usuarioId: string, page: number = 1, limit: number = 10): Observable<HistorialCambiosResponse> {
    return this.obtenerHistorial({
      usuario_id: usuarioId,
      page,
      limit
    });
  }

  /**
   * Método auxiliar para crear un registro de cambio
   */
  crearRegistroCambio(
    entidadTipo: 'embarcacion' | 'usuario' | 'cliente' | 'servicio',
    entidadId: string,
    entidadNombre: string,
    accion: 'crear' | 'editar' | 'eliminar' | 'activar' | 'desactivar',
    camposModificados: Array<{campo: string, valor_anterior: any, valor_nuevo: any}>,
    usuarioId: string,
    usuarioNombre: string
  ): HistorialCambio {
    return {
      usuario_id: usuarioId,
      usuario_nombre: usuarioNombre,
      entidad_tipo: entidadTipo,
      entidad_id: entidadId,
      entidad_nombre: entidadNombre,
      accion: accion,
      campos_modificados: camposModificados,
      fecha_cambio: new Date()
    };
  }
}