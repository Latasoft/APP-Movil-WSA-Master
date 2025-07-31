import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedUsersResponse, UserByIdResponse, Usuario } from '../models/usuario';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, tap, switchMap } from 'rxjs/operators';
import { HistorialCambiosService } from './historial-cambios.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

 private apiUrl = `${environment.apiUrl}/users`;
 
   constructor(
     private http: HttpClient,
     private historialCambiosService: HistorialCambiosService,
     private authService: AuthService
   ) { }

   // Método de prueba para verificar conectividad
   testConnection(): Observable<any> {
     return this.http.get(`${environment.apiUrl}/health`);
   }

   registarUsuario(usuario:Usuario):Observable<Usuario>{
    return this.http.post<Usuario>(`${this.apiUrl}`,usuario).pipe(
      tap(usuarioCreado => {
        // Registrar la creación en el historial
        const userId = this.authService.getIdFromToken();
        if (userId) {
          this.historialCambiosService.registrarCambio({
             usuario_id: userId,
             entidad_tipo: 'usuario',
             entidad_id: usuarioCreado._id || 'nuevo',
             entidad_nombre: usuario.username || 'Nuevo Usuario',
             accion: 'crear',
             campos_modificados: [
               {
                 campo: 'usuario_creado',
                 valor_anterior: 'N/A',
                 valor_nuevo: 'Usuario creado exitosamente'
               }
             ],
             ip_usuario: 'N/A',
             fecha_cambio: new Date()
           }).subscribe({
            next: () => console.log('Creación de usuario registrada en historial'),
            error: (error) => console.error('Error al registrar creación de usuario:', error)
          });
        }
      })
    );
   }
 
   getUsersPaginated(page = 1, limit = 10): Observable<PaginatedUsersResponse> {
    const url = `${this.apiUrl}/?page=${page}&limit=${limit}`;
    return this.http.get<PaginatedUsersResponse>(url);
  }
  getUserById(_id:string):Observable<UserByIdResponse>{
    return this.http.get<UserByIdResponse>(`${this.apiUrl}/${_id}`)
  }

  updateUser(_id:string,usuario:Usuario):Observable<Usuario>{
    // Primero obtener los datos anteriores para comparar
    return this.getUserById(_id).pipe(
      switchMap(response => {
        const usuarioAnterior = response.userResponse;
        
        // Ejecutar la actualización
        return this.http.put<Usuario>(`${this.apiUrl}/${_id}`, usuario).pipe(
          switchMap(usuarioActualizado => {
            // Registrar el cambio en el historial con comparación real
            const userId = this.authService.getIdFromToken();
            if (userId && usuarioAnterior) {
              // Comparar los datos anteriores con los nuevos
              const camposModificados = this.compararUsuarios(usuarioAnterior, usuario);
              
              // Solo registrar si hay cambios reales
              if (camposModificados.length > 0) {
                console.log('Registrando cambios de usuario en historial:', camposModificados);
                return this.historialCambiosService.registrarCambio({
                   usuario_id: userId,
                   usuario_nombre: this.authService.getUsernameFromToken() || 'Usuario',
                   entidad_tipo: 'usuario',
                   entidad_id: _id,
                   entidad_nombre: usuario.username || 'Usuario',
                   accion: 'editar',
                   campos_modificados: camposModificados,
                   ip_usuario: 'N/A',
                   fecha_cambio: new Date()
                 }).pipe(
                   tap({
                     next: () => console.log('Cambio de usuario registrado exitosamente en historial'),
                     error: (error) => console.error('Error al registrar cambio de usuario en historial:', error)
                   }),
                   switchMap(() => of(usuarioActualizado))
                 );
              } else {
                console.log('No se detectaron cambios de usuario para registrar');
                return of(usuarioActualizado);
              }
            }
            return of(usuarioActualizado);
          })
        );
      })
    );
  }


  getAllTRABAJADOResPaginados():Observable<{TRABAJADORes:Usuario[]}>{
    return this.http.get<{TRABAJADORes:Usuario[]}>(`${this.apiUrl}/TRABAJADORes`)
  }
  deleteUser(_id:string):Observable<Usuario>{
    return this.getUserById(_id).pipe(
      switchMap(response => {
        const usuarioAEliminar = response.userResponse;
        
        return this.http.delete<Usuario>(`${this.apiUrl}/${_id}`).pipe(
          switchMap(usuarioEliminado => {
            // Registrar la eliminación en el historial
            const userId = this.authService.getIdFromToken();
            if (userId && usuarioAEliminar) {
              console.log('Registrando eliminación de usuario en historial');
              return this.historialCambiosService.registrarCambio({
                 usuario_id: userId,
                 usuario_nombre: this.authService.getUsernameFromToken() || 'Usuario',
                 entidad_tipo: 'usuario',
                 entidad_id: _id,
                 entidad_nombre: usuarioAEliminar.username || 'Usuario Eliminado',
                 accion: 'eliminar',
                 campos_modificados: [
                   {
                     campo: 'usuario_eliminado',
                     valor_anterior: 'Activo',
                     valor_nuevo: 'Eliminado'
                   }
                 ],
                 ip_usuario: 'N/A',
                 fecha_cambio: new Date()
               }).pipe(
                 tap({
                   next: () => console.log('Eliminación de usuario registrada exitosamente en historial'),
                   error: (error) => console.error('Error al registrar eliminación de usuario en historial:', error)
                 }),
                 switchMap(() => of(usuarioEliminado))
               );
            }
            return of(usuarioEliminado);
          })
        );
      })
    );
  }

  getUsersByRole( page: number, limit: number,role: string) {
    const url = `${this.apiUrl}/?role=${role}&page=${page}&limit=${limit}`;
    console.log('URL del servicio getUsersByRole:', url);
    return this.http.get<PaginatedUsersResponse>(url);
  }

  // Método para obtener todos los usuarios sin paginación
  getAllUsers(): Observable<Usuario[]> {
    return this.http.get<PaginatedUsersResponse>(`${this.apiUrl}/?page=1&limit=1000`).pipe(
      map(response => {
        console.log('Respuesta del servidor:', response);
        console.log('Users en la respuesta:', response.users);
        console.log('Total de usuarios:', response.totalUsers);
        return response.users || [];
      })
    );
  }

  actualizarCampo(id: string, body: any) {
    return this.http.patch(`${this.apiUrl}/${id}`, body);
  }

  private compararUsuarios(anterior: Usuario, nuevo: Usuario): any[] {
    const cambios: any[] = [];
    
    // Comparar username
    if (anterior.username !== nuevo.username) {
      cambios.push({
        campo: 'Nombre de usuario',
        valor_anterior: anterior.username,
        valor_nuevo: nuevo.username
      });
    }
    
    // Comparar email
    if (anterior.email !== nuevo.email) {
      cambios.push({
        campo: 'Email',
        valor_anterior: anterior.email,
        valor_nuevo: nuevo.email
      });
    }
    
    // Comparar tipo de usuario
    if (anterior.tipo_usuario !== nuevo.tipo_usuario) {
      cambios.push({
        campo: 'Tipo de usuario',
        valor_anterior: anterior.tipo_usuario,
        valor_nuevo: nuevo.tipo_usuario
      });
    }
    
    // Comparar dato de contacto
    if (anterior.dato_contacto_cliente !== nuevo.dato_contacto_cliente) {
      cambios.push({
        campo: 'Dato de contacto',
        valor_anterior: anterior.dato_contacto_cliente || 'N/A',
        valor_nuevo: nuevo.dato_contacto_cliente || 'N/A'
      });
    }
    
    // Comparar país del cliente
    if (anterior.pais_cliente !== nuevo.pais_cliente) {
      cambios.push({
        campo: 'País del cliente',
        valor_anterior: anterior.pais_cliente || 'N/A',
        valor_nuevo: nuevo.pais_cliente || 'N/A'
      });
    }
    
    // Comparar nombre del cliente
    if (anterior.nombre_cliente !== nuevo.nombre_cliente) {
      cambios.push({
        campo: 'Nombre del cliente',
        valor_anterior: anterior.nombre_cliente || 'N/A',
        valor_nuevo: nuevo.nombre_cliente || 'N/A'
      });
    }
    
    // Comparar empresa del cliente
    if (anterior.empresa_cliente !== nuevo.empresa_cliente) {
      cambios.push({
        campo: 'Empresa del cliente',
        valor_anterior: anterior.empresa_cliente || 'N/A',
        valor_nuevo: nuevo.empresa_cliente || 'N/A'
      });
    }
    
    return cambios;
  }

}
