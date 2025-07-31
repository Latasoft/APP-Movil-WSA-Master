import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { Cliente } from '../models/cliente';
import { environment } from 'src/environments/environment';
import { HistorialCambiosService } from './historial-cambios.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = `${environment.apiUrl}/clientes`; 
   
  constructor(
    private http: HttpClient,
    private historialCambiosService: HistorialCambiosService,
    private authService: AuthService
  ) { }


  getClienteById(_id:string):Observable<{clientes:Cliente}>{
    return this.http.get<{clientes:Cliente}>(`${this.apiUrl}/${_id}`)
  }

  updateClient(_id:string, cliente:Cliente, foto_cliente:File):Observable<Cliente>{
    // Primero obtener los datos anteriores para comparar
    return this.getClienteById(_id).pipe(
      switchMap(response => {
        const clienteAnterior = response.clientes;
        
        const formData:FormData=new FormData();
        formData.append('pais_cliente',cliente.pais_cliente)
        formData.append('nombre_cliente',cliente.nombre_cliente)
        formData.append('dato_contacto_cliente',cliente.dato_contacto_cliente)
        // Solo se añade la foto si se proporciona
        if (foto_cliente) {
          formData.append('foto_cliente', foto_cliente);
        } else {
          console.log('No se proporcionó imagen');
        }
        
        // Ejecutar la actualización
        return this.http.put<Cliente>(`${this.apiUrl}/${_id}`,formData).pipe(
          switchMap(clienteActualizado => {
            // Registrar el cambio en el historial con comparación real
            const userId = this.authService.getIdFromToken();
            if (userId && clienteAnterior) {
              // Comparar los datos anteriores con los nuevos
              const camposModificados = this.compararClientes(clienteAnterior, cliente, !!foto_cliente);
              
              // Solo registrar si hay cambios reales
              if (camposModificados.length > 0) {
                console.log('Registrando cambios de cliente en historial:', camposModificados);
                return this.historialCambiosService.registrarCambio({
                   usuario_id: userId,
                   usuario_nombre: this.authService.getUsernameFromToken() || 'Usuario',
                   entidad_tipo: 'cliente',
                   entidad_id: _id,
                   entidad_nombre: cliente.nombre_cliente || 'Cliente',
                   accion: 'editar',
                   campos_modificados: camposModificados,
                   ip_usuario: 'N/A',
                   fecha_cambio: new Date()
                 }).pipe(
                   tap({
                     next: () => console.log('Cambio de cliente registrado exitosamente en historial'),
                     error: (error) => console.error('Error al registrar cambio de cliente en historial:', error)
                   }),
                   switchMap(() => of(clienteActualizado))
                 );
              } else {
                console.log('No se detectaron cambios de cliente para registrar');
                return of(clienteActualizado);
              }
            }
            return of(clienteActualizado);
          })
        );
      })
    );
  }

  getAllClientesPaginados():Observable<{clientes:Cliente[]}>{
    return this.http.get<{clientes:Cliente[]}>(`${this.apiUrl}`)
  }
  
  private compararClientes(anterior: Cliente, nuevo: Cliente, fotoModificada: boolean): any[] {
    const cambios: any[] = [];
    
    // Comparar campos principales
    if (anterior.nombre_cliente !== nuevo.nombre_cliente) {
      cambios.push({
        campo: 'nombre_cliente',
        valor_anterior: anterior.nombre_cliente,
        valor_nuevo: nuevo.nombre_cliente
      });
    }
    
    if (anterior.pais_cliente !== nuevo.pais_cliente) {
      cambios.push({
        campo: 'pais_cliente',
        valor_anterior: anterior.pais_cliente,
        valor_nuevo: nuevo.pais_cliente
      });
    }
    
    if (anterior.dato_contacto_cliente !== nuevo.dato_contacto_cliente) {
      cambios.push({
        campo: 'dato_contacto_cliente',
        valor_anterior: anterior.dato_contacto_cliente,
        valor_nuevo: nuevo.dato_contacto_cliente
      });
    }
    
    // Si se modificó la foto
    if (fotoModificada) {
      cambios.push({
        campo: 'foto_cliente',
        valor_anterior: 'Foto anterior',
        valor_nuevo: 'Foto actualizada'
      });
    }
    
    return cambios;
  }
  
}
