import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Mensaje } from '../models/mesnaje';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  private apiUrl = `${environment.apiUrl}/mensajes`; // Ajusta si tu ruta es diferente

  constructor(private http: HttpClient) {}

  // Obtener mensajes con paginación
  getMessages(groupId: string,cursor?: string, limit: number = 20) {
    let params = new HttpParams().set('limit', limit);
  if (cursor) {
    params = params.set('cursor', cursor);
  }

  return this.http.get<{
    messages: Mensaje[];
    cursor: string ;
    hasMore: boolean;
  }>(`${this.apiUrl}/${groupId}`, { params });
  }

  // Enviar nuevo mensaje
  createMessage(data: Omit<Mensaje, '_id' | 'sentAt'>) {
    return this.http.post<{ mensaje: Mensaje }>(`${this.apiUrl}`, data);
  }
}
