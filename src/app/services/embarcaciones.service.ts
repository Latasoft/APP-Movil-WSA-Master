import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Embarcacion, IGetEmbarcacionResponse } from '../models/embarcacion';
import { Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EmbarcacionActualizada } from '../models/embarcacion';
import { HistorialCambiosService } from './historial-cambios.service';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class EmbarcacionesService {
  

  private apiUrl=`${environment.apiUrl}/embarcaciones`;

  constructor(
    private http: HttpClient,
    private historialCambiosService: HistorialCambiosService,
    private authService: AuthService
  ) { }

  private servicios = [
    {
      nombre_servicio: "Maritime Solutions",
      estados: [
        {
          nombre_estado: "Provisions and Bonds",
          acciones: [
            { nombre: "Recepción de mercancía" },
            { nombre: "Carga de mercancía" }
          ]
        },
        {
          nombre_estado: "Technical Assitance and Products",
          acciones: [{ nombre: "Registro en hotel", fecha: "2025-02-26T12:00:00.000Z" }]
        },
        {
          nombre_estado: "WorkShop Coordination",
          acciones: [{ nombre: "Despacho a aeropuerto", fecha: "2025-02-26T16:00:00.000Z" }]
        },{
          nombre_estado: "Diving Service Coordination",
          acciones: [{ nombre: "Despacho a aeropuerto", fecha: "2025-02-26T16:00:00.000Z" }]
        },{
          nombre_estado: "Marine Surveyor Arrangement",
          acciones: [{ nombre: "Despacho a aeropuerto", fecha: "2025-02-26T16:00:00.000Z" }]
        }
      ]
    },
    {
      nombre_servicio: "Maritime Logistic",
      estados: [
        {
          nombre_estado: "Last Mile",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },
        {
          nombre_estado: "Sample shipping",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },{
          nombre_estado: "Cargo Shipping",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },{
          nombre_estado: "Landing and Return By Courier",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },{
          nombre_estado: "Airfreight Coordination",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },{
          nombre_estado: "Seafreight Coordination",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },{
          nombre_estado: "Courier on Board Clearance ",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },{
          nombre_estado: "Landing and Return Spare Parts",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        }
      ]
    },
    {
      nombre_servicio: "Antarctic Services ",
      estados: [
        {
          nombre_estado: "Port Technical Services",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },
        {
          nombre_estado: "Port Technical Services",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },{
          nombre_estado: "Custom Process",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },
        {
          nombre_estado: "Representation",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },
        {
          nombre_estado: "Local Subpplier And Provisions to Expeditions",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        }
        
      ]
    },
    {
      nombre_servicio: "Maritime Support",
      estados: [
        {
          nombre_estado: "Hub Agent",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },
        {
          nombre_estado: "Part Asistence",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },
        {
          nombre_estado: "Account Supervision",
          acciones: [
            { nombre: "Recepción de mercancía" },
            { nombre: "Carga de mercancía" }
          ]
        },
        {
          nombre_estado: "Tax Recovery (Chile)",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        }

      ]
    },
    {
      nombre_servicio: "Full  Agent",
      estados: [
        {
          nombre_estado: "Full Port Agent",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },
        {
          nombre_estado: "Protective Agency",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },
        {
          nombre_estado: "Bunkering Call",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },
        {
          nombre_estado: "Logistic Call",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },
        {
          nombre_estado: "Panama Channel Transit",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },
        {
          nombre_estado: "Magellan Strait Pilotage",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        }

      ]
    },
    {
      nombre_servicio: "Husbandry Agent",
      estados: [
        {
          nombre_estado: "Crew Change",
          acciones: [
            { nombre: "Inicio de otro servicio" },
            { nombre: "Sub servicio 2" },
            { nombre: "Sub servicio 3" },
            { nombre: "Sub servicio 4" },
            { nombre: "Sub servicio 5" },
            { nombre: "Sub servicio 6" },
            { nombre: "Sub servicio 7" },
            { nombre: "Sub servicio 8" },
            { nombre: "Sub servicio 9" },
            { nombre: "Sub servicio 10" },
            { nombre: "Sub servicio 11" },
            { nombre: "Sub servicio 12" },
            { nombre: "Sub servicio 13" },
            { nombre: "Sub servicio 14" },
            { nombre: "Sub servicio 15" },
            { nombre: "Sub servicio 16" },
            { nombre: "Sub servicio 17" },
            { nombre: "Sub servicio 18" },
            { nombre: "Sub servicio 19" },
            { nombre: "Sub servicio 20" }



          ]
        },{
          nombre_estado: "Medical Assistance",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },{
          nombre_estado: "Visa Authorization on Arraival",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },{
          nombre_estado: "Hotel Service",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },
        {
          nombre_estado: "Transportation",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },
        {
          nombre_estado: "Working Permit",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },
        {
          nombre_estado: "Cash to Master",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        },
        {
          nombre_estado: "Ok to Board Issuance",
          acciones: [{ nombre: "Inicio de otro servicio", fecha: "2025-02-26T10:30:00.000Z" }]
        }

      ]
    }

  ];

  obtenerReporteTodas(): Observable<IGetEmbarcacionResponse> {
    return this.http.get<IGetEmbarcacionResponse>(
      `${this.apiUrl}/reporte-todas-embarcaciones`
    );
  }

  crearEmbarcacion(embarcacion: Embarcacion): Observable<Embarcacion> {
    return this.http.post<Embarcacion>(this.apiUrl, embarcacion).pipe(
      tap(embarcacionCreada => {
        // Registrar la creación en el historial
        const userId = this.authService.getIdFromToken();
        if (userId) {
          this.historialCambiosService.registrarCambio({
             usuario_id: userId,
             entidad_tipo: 'embarcacion',
             entidad_id: embarcacionCreada._id || 'nuevo',
             entidad_nombre: embarcacion.titulo_embarcacion || 'Nueva Embarcación',
             accion: 'crear',
             campos_modificados: [
               {
                 campo: 'embarcacion_creada',
                 valor_anterior: 'N/A',
                 valor_nuevo: 'Embarcación creada exitosamente'
               }
             ],
             ip_usuario: 'N/A',
             fecha_cambio: new Date()
           }).subscribe({
            next: () => console.log('Creación registrada en historial'),
            error: (error) => console.error('Error al registrar creación:', error)
          });
        }
      })
    );
  }

  getEmbarcacionById(_id:string):Observable<{data:Embarcacion}>{
    return this.http.get<{data:Embarcacion}>(`${this.apiUrl}/${_id}`)
  }
  getEmbarcacionByIdAndClienteId(embarcacionId: string, clienteId: string) {
  return this.http.get<{ data: Embarcacion }>(
    `${this.apiUrl}/${embarcacionId}/cliente/${clienteId}`
  );
}


  deleteEmbarcacion(_id: string): Observable<{data: Embarcacion}> {
    return this.http.delete<{data: Embarcacion}>(`${this.apiUrl}/${_id}`).pipe(
      tap(response => {
        // Registrar la eliminación en el historial
        const userId = this.authService.getIdFromToken();
        if (userId && response.data) {
          this.historialCambiosService.registrarCambio({
             usuario_id: userId,
             entidad_tipo: 'embarcacion',
             entidad_id: _id,
             entidad_nombre: response.data.titulo_embarcacion || 'Embarcación Eliminada',
             accion: 'eliminar',
             campos_modificados: [
               {
                 campo: 'embarcacion_eliminada',
                 valor_anterior: 'Activa',
                 valor_nuevo: 'Eliminada'
               }
             ],
             ip_usuario: 'N/A',
             fecha_cambio: new Date()
           }).subscribe({
             next: () => console.log('Eliminación registrada en historial'),
             error: (error) => console.error('Error al registrar eliminación:', error)
           });
        }
      })
    );
  }


  getEmbarcacioneByClienteId(_id: string, page: number = 1, limit: number = 10) {
    return this.http.get(`${this.apiUrl}/cliente/${_id}?page=${page}&limit=${limit}`);
  }
  getEmbarcacionesByTRABAJADORId(_id: string, page: number, limit: number) {
    // Ejemplo: GET /embarcaciones/TRABAJADOR/:id?page=...
    return this.http.get(`${this.apiUrl}/TRABAJADOR/${_id}?page=${page}&limit=${limit}`);
  }



  getEmbarcacionesAdmin(page: number, limit: number) {
    // Ejemplo: GET /embarcaciones/admin?page=...
    return this.http.get(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  updateEmbarcacion(_id: string, embarcacion: Embarcacion): Observable<Embarcacion> {
    // Primero obtener la embarcación anterior para comparar
    return this.getEmbarcacionById(_id).pipe(
      switchMap(response => {
        const embarcacionAnterior = response.data;
        
        // Ejecutar la actualización
        return this.http.put<Embarcacion>(`${this.apiUrl}/${_id}`, embarcacion).pipe(
          switchMap(embarcacionActualizada => {
            // Comparar cambios entre la versión anterior y la nueva
            const cambiosDetectados = this.compararEmbarcaciones(embarcacionAnterior, embarcacion);
            
            const userId = this.authService.getIdFromToken();
            if (userId && cambiosDetectados.length > 0) {
              console.log('🔍 Cambios detectados:', cambiosDetectados);
              
              return this.historialCambiosService.registrarCambio({
                usuario_id: userId,
                usuario_nombre: this.authService.getUsernameFromToken() || 'Usuario',
                entidad_tipo: 'embarcacion',
                entidad_id: _id,
                entidad_nombre: embarcacion.titulo_embarcacion || 'Embarcación',
                accion: 'editar',
                campos_modificados: cambiosDetectados,
                ip_usuario: 'N/A',
                fecha_cambio: new Date()
              }).pipe(
                tap({
                  next: () => console.log('✅ Cambios específicos registrados en historial:', cambiosDetectados.length),
                  error: (error) => console.error('❌ Error al registrar cambios en historial:', error)
                }),
                switchMap(() => of(embarcacionActualizada))
              );
            } else if (userId) {
              // Si no hay cambios detectados, registrar acción de guardado genérica
              console.log('ℹ️ No se detectaron cambios, registrando acción de guardado');
              return this.historialCambiosService.registrarCambio({
                usuario_id: userId,
                usuario_nombre: this.authService.getUsernameFromToken() || 'Usuario',
                entidad_tipo: 'embarcacion',
                entidad_id: _id,
                entidad_nombre: embarcacion.titulo_embarcacion || 'Embarcación',
                accion: 'editar',
                campos_modificados: [{
                  campo: 'accion_guardado',
                  valor_anterior: 'N/A',
                  valor_nuevo: 'Datos guardados'
                }],
                ip_usuario: 'N/A',
                fecha_cambio: new Date()
              }).pipe(
                tap({
                  next: () => console.log('✅ Acción de guardado registrada'),
                  error: (error) => console.error('❌ Error al registrar acción:', error)
                }),
                switchMap(() => of(embarcacionActualizada))
              );
            }
            
            return of(embarcacionActualizada);
          })
        );
      })
    );
  }

  private compararEmbarcaciones(anterior: Embarcacion, nueva: Embarcacion): any[] {
    const cambios: any[] = [];
    
    // Funciones auxiliares para normalización y comparación
    const normalizar = (valor: any): string => {
      if (valor === null || valor === undefined || valor === '') {
        return '';
      }
      return String(valor).trim();
    };
    
    const sonDiferentes = (valor1: any, valor2: any): boolean => {
      const norm1 = normalizar(valor1);
      const norm2 = normalizar(valor2);
      return norm1 !== norm2;
    };
    
    // Comparar campos principales
    if (sonDiferentes(anterior.titulo_embarcacion, nueva.titulo_embarcacion)) {
      cambios.push({
        campo: 'titulo_embarcacion',
        valor_anterior: normalizar(anterior.titulo_embarcacion),
        valor_nuevo: normalizar(nueva.titulo_embarcacion)
      });
    }
    
    if (sonDiferentes(anterior.destino_embarcacion, nueva.destino_embarcacion)) {
      cambios.push({
        campo: 'destino_embarcacion',
        valor_anterior: normalizar(anterior.destino_embarcacion),
        valor_nuevo: normalizar(nueva.destino_embarcacion)
      });
    }
    
    if (anterior.is_activated !== nueva.is_activated) {
      cambios.push({
        campo: 'is_activated',
        valor_anterior: anterior.is_activated,
        valor_nuevo: nueva.is_activated
      });
    }

    if (sonDiferentes((anterior as any).da_numero, (nueva as any).da_numero)) {
      cambios.push({
        campo: 'da_numero',
        valor_anterior: normalizar((anterior as any).da_numero),
        valor_nuevo: normalizar((nueva as any).da_numero)
      });
    }

    // Comparar todos los tipos de comentarios y notas
    if (sonDiferentes((anterior as any).comentario_general, (nueva as any).comentario_general)) {
      cambios.push({
        campo: 'comentario_general',
        valor_anterior: normalizar((anterior as any).comentario_general),
        valor_nuevo: normalizar((nueva as any).comentario_general)
      });
    }

    // Comparar estado actual
    if (sonDiferentes((anterior as any).estado_actual, (nueva as any).estado_actual)) {
      cambios.push({
        campo: 'estado_actual',
        valor_anterior: normalizar((anterior as any).estado_actual),
        valor_nuevo: normalizar((nueva as any).estado_actual)
      });
    }

    // Comparar servicio y subservicio
    if (sonDiferentes((anterior as any).servicio, (nueva as any).servicio)) {
      cambios.push({
        campo: 'servicio',
        valor_anterior: normalizar((anterior as any).servicio),
        valor_nuevo: normalizar((nueva as any).servicio)
      });
    }

    if (sonDiferentes((anterior as any).subservicio, (nueva as any).subservicio)) {
      cambios.push({
        campo: 'subservicio',
        valor_anterior: normalizar((anterior as any).subservicio),
        valor_nuevo: normalizar((nueva as any).subservicio)
      });
    }

    // Comparar servicio relacionado y sus campos
    if (sonDiferentes((anterior as any).servicio_relacionado, (nueva as any).servicio_relacionado)) {
      cambios.push({
        campo: 'servicio_relacionado',
        valor_anterior: normalizar((anterior as any).servicio_relacionado),
        valor_nuevo: normalizar((nueva as any).servicio_relacionado)
      });
    }

    if (sonDiferentes((anterior as any).fecha_servicio_relacionado, (nueva as any).fecha_servicio_relacionado)) {
      cambios.push({
        campo: 'fecha_servicio_relacionado',
        valor_anterior: normalizar((anterior as any).fecha_servicio_relacionado),
        valor_nuevo: normalizar((nueva as any).fecha_servicio_relacionado)
      });
    }

    if (sonDiferentes((anterior as any).nota_servicio_relacionado, (nueva as any).nota_servicio_relacionado)) {
      cambios.push({
        campo: 'nota_servicio_relacionado',
        valor_anterior: normalizar((anterior as any).nota_servicio_relacionado),
        valor_nuevo: normalizar((nueva as any).nota_servicio_relacionado)
      });
    }

    // Comparar todas las fechas - convertir a string para comparación
    const formatearFecha = (fecha: any) => {
      if (!fecha || fecha === null || fecha === undefined || fecha === '') return '';
      if (fecha instanceof Date) return fecha.toISOString();
      return String(fecha).trim();
    };

    const fechasComparar = [
      { campo: 'fecha_arribo', anterior: anterior.fecha_arribo, nueva: nueva.fecha_arribo },
      { campo: 'fecha_zarpe', anterior: anterior.fecha_zarpe, nueva: nueva.fecha_zarpe },
      { campo: 'fecha_estimada_zarpe', anterior: anterior.fecha_estimada_zarpe, nueva: nueva.fecha_estimada_zarpe },
      { campo: 'eta', anterior: (anterior as any).eta, nueva: (nueva as any).eta },
      { campo: 'etb', anterior: (anterior as any).etb, nueva: (nueva as any).etb },
      { campo: 'etd', anterior: (anterior as any).etd, nueva: (nueva as any).etd }
    ];

    fechasComparar.forEach(({ campo, anterior: fechaAnterior, nueva: fechaNueva }) => {
      const anteriorStr = formatearFecha(fechaAnterior);
      const nuevaStr = formatearFecha(fechaNueva);
      
      // Solo registrar cambio si hay una diferencia significativa
      if (anteriorStr !== nuevaStr && !(anteriorStr === '' && nuevaStr === '')) {
        cambios.push({
          campo,
          valor_anterior: anteriorStr,
          valor_nuevo: nuevaStr
        });
      }
    });

    // Comparar servicios relacionados (array)
    const anteriorServiciosRel = (anterior as any).servicios_relacionados || [];
    const nuevosServiciosRel = (nueva as any).servicios_relacionados || [];
    
    // Detectar servicios relacionados agregados
    nuevosServiciosRel.forEach((nuevoServRel: any, index: number) => {
      const servicioExistente = anteriorServiciosRel.find((ant: any) => 
        ant.nombre === nuevoServRel.nombre && 
        ant.fecha === nuevoServRel.fecha
      );
      
      if (!servicioExistente) {
        cambios.push({
          campo: 'servicios_relacionados',
          accion: 'agregado',
          valor_nuevo: `${nuevoServRel.nombre} - ${nuevoServRel.fecha}${nuevoServRel.nota ? ' (' + nuevoServRel.nota + ')' : ''}${nuevoServRel.estado ? ' [' + nuevoServRel.estado + ']' : ''}`
        });
      } else {
        // Comparar cambios en servicios relacionados existentes
        if (sonDiferentes(servicioExistente.nota, nuevoServRel.nota)) {
          cambios.push({
            campo: 'servicios_relacionados_nota',
            valor_anterior: normalizar(servicioExistente.nota),
            valor_nuevo: normalizar(nuevoServRel.nota),
            contexto: `${nuevoServRel.nombre} - ${nuevoServRel.fecha}`
          });
        }
        
        if (sonDiferentes(servicioExistente.estado, nuevoServRel.estado)) {
          cambios.push({
            campo: 'servicios_relacionados_estado',
            valor_anterior: normalizar(servicioExistente.estado),
            valor_nuevo: normalizar(nuevoServRel.estado),
            contexto: `${nuevoServRel.nombre} - ${nuevoServRel.fecha}`
          });
        }
      }
    });
    
    // Detectar servicios relacionados eliminados
    anteriorServiciosRel.forEach((anteriorServRel: any) => {
      const servicioEnNuevo = nuevosServiciosRel.find((nuevo: any) => 
        nuevo.nombre === anteriorServRel.nombre && 
        nuevo.fecha === anteriorServRel.fecha
      );
      
      if (!servicioEnNuevo) {
        cambios.push({
          campo: 'servicios_relacionados',
          accion: 'eliminado',
          valor_anterior: `${anteriorServRel.nombre} - ${anteriorServRel.fecha}${anteriorServRel.nota ? ' (' + anteriorServRel.nota + ')' : ''}${anteriorServRel.estado ? ' [' + anteriorServRel.estado + ']' : ''}`
        });
      }
    });
    
    // Comparar trabajadores asignados
    const trabajadoresAnteriores = anterior.trabajadores || [];
    const trabajadoresNuevos = nueva.trabajadores || [];
    
    // Detectar trabajadores agregados
    trabajadoresNuevos.forEach(trabajadorNuevo => {
      const trabajadorExistente = trabajadoresAnteriores.find(ant => 
        ant.trabajadorId === trabajadorNuevo.trabajadorId
      );
      
      if (!trabajadorExistente) {
        cambios.push({
          campo: 'trabajadores',
          accion: 'agregado',
          valor_nuevo: trabajadorNuevo.trabajadorId
        });
      }
    });
    
    // Detectar trabajadores eliminados
    trabajadoresAnteriores.forEach(trabajadorAnterior => {
      const trabajadorEnNuevo = trabajadoresNuevos.find(nuevo => 
        nuevo.trabajadorId === trabajadorAnterior.trabajadorId
      );
      
      if (!trabajadorEnNuevo) {
        cambios.push({
          campo: 'trabajadores',
          accion: 'eliminado',
          valor_anterior: trabajadorAnterior.trabajadorId
        });
      }
    });

    // Comparar clientes asignados
    const clientesAnteriores = anterior.clientes || [];
    const clientesNuevos = nueva.clientes || [];
    
    // Detectar clientes agregados
    clientesNuevos.forEach(clienteNuevo => {
      const clienteExistente = clientesAnteriores.find(ant => 
        ant.cliente_id === clienteNuevo.cliente_id
      );
      
      if (!clienteExistente) {
        cambios.push({
          campo: 'clientes',
          accion: 'agregado',
          valor_nuevo: clienteNuevo.cliente_id
        });
      }
    });
    
    // Detectar clientes eliminados
    clientesAnteriores.forEach(clienteAnterior => {
      const clienteEnNuevo = clientesNuevos.find(nuevo => 
        nuevo.cliente_id === clienteAnterior.cliente_id
      );
      
      if (!clienteEnNuevo) {
        cambios.push({
          campo: 'clientes',
          accion: 'eliminado',
          valor_anterior: clienteAnterior.cliente_id
        });
      }
    });

    // Comparar permisos de embarcación
    const permisosAnteriores = (anterior as any).permisos_embarcacion || [];
    const permisosNuevos = (nueva as any).permisos_embarcacion || [];
    
    // Detectar permisos agregados
    permisosNuevos.forEach((permisoNuevo: any) => {
      const permisoExistente = permisosAnteriores.find((ant: any) => 
        ant.nombre_permiso === permisoNuevo.nombre_permiso
      );
      
      if (!permisoExistente) {
        cambios.push({
          campo: 'permisos_embarcacion',
          accion: 'agregado',
          valor_nuevo: permisoNuevo.nombre_permiso
        });
      }
    });
    
    // Detectar permisos eliminados
    permisosAnteriores.forEach((permisoAnterior: any) => {
      const permisoEnNuevo = permisosNuevos.find((nuevo: any) => 
        nuevo.nombre_permiso === permisoAnterior.nombre_permiso
      );
      
      if (!permisoEnNuevo) {
        cambios.push({
          campo: 'permisos_embarcacion',
          accion: 'eliminado',
          valor_anterior: permisoAnterior.nombre_permiso
        });
      }
    });

    // Comparar servicios relacionados
    const anteriorServicios = (anterior as any).servicios_relacionados || [];
    const nuevosServicios = (nueva as any).servicios_relacionados || [];
    const serviciosAnteriores = JSON.stringify(anteriorServicios);
    const serviciosNuevos = JSON.stringify(nuevosServicios);
    
    if (serviciosAnteriores !== serviciosNuevos) {
      cambios.push({
        campo: 'servicios_relacionados',
        valor_anterior: anteriorServicios?.length ? `${anteriorServicios.length} servicios` : 'Ninguno',
        valor_nuevo: nuevosServicios?.length ? `${nuevosServicios.length} servicios` : 'Ninguno'
      });
    }
    
    return cambios;
  }

  private formatearCambiosParaHistorial(cambios: any[]): string {
    if (cambios.length === 0) return 'Sin cambios detectados';
    
    const cambiosFormateados = cambios.map(cambio => {
      const nombreCampo = this.obtenerNombreCampo(cambio.campo);
      
      if (cambio.accion === 'agregado') {
        return `<span class="cambio-agregado">✅ Se agregó ${nombreCampo}: ${cambio.valor_nuevo}</span>`;
      } else if (cambio.accion === 'eliminado') {
        return `<span class="cambio-eliminado">❌ Se eliminó ${nombreCampo}: ${cambio.valor_anterior}</span>`;
      } else if (cambio.contexto) {
        // Cambio con contexto (para servicios relacionados)
        const valorAnterior = cambio.valor_anterior || 'No definido';
        const valorNuevo = cambio.valor_nuevo || 'No definido';
        return `<span class="cambio-editado">📝 Se cambió ${nombreCampo} (${cambio.contexto}): antes había "${valorAnterior}", ahora está "${valorNuevo}"</span>`;
      } else {
        // Cambio editado normal
        const valorAnterior = cambio.valor_anterior || 'No definido';
        const valorNuevo = cambio.valor_nuevo || 'No definido';
        
        if (valorAnterior === 'No definido' || valorAnterior === '' || valorAnterior === null) {
          return `<span class="cambio-agregado">✅ Se agregó ${nombreCampo}: "${valorNuevo}"</span>`;
        } else if (valorNuevo === 'No definido' || valorNuevo === '' || valorNuevo === null) {
          return `<span class="cambio-eliminado">❌ Se eliminó ${nombreCampo}: antes tenía "${valorAnterior}"</span>`;
        } else {
          return `<span class="cambio-editado">📝 Se cambió ${nombreCampo}: antes había "${valorAnterior}", ahora está "${valorNuevo}"</span>`;
        }
      }
    });
    
    return cambiosFormateados.join('<br>');
  }

  private obtenerNombreCampo(campo: string): string {
    const mapaCampos: { [key: string]: string } = {
      'titulo_embarcacion': 'Título de Embarcación',
      'destino_embarcacion': 'Destino',
      'is_activated': 'Estado de Activación',
      'da_numero': 'Número DA',
      'comentario_general': 'Comentario General',
      'estado_actual': 'Estado Actual',
      'servicio': 'Servicio',
      'subservicio': 'Subservicio',
      'servicio_relacionado': 'Servicio Relacionado',
      'fecha_servicio_relacionado': 'Fecha Servicio Relacionado',
      'nota_servicio_relacionado': 'Nota Servicio Relacionado',
      'fecha_arribo': 'Fecha de Arribo',
      'fecha_zarpe': 'Fecha de Zarpe',
      'fecha_estimada_zarpe': 'Fecha Estimada de Zarpe',
      'eta': 'ETA',
      'etb': 'ETB',
      'etd': 'ETD',
      'servicios_relacionados': 'Servicios Relacionados',
      'servicios_relacionados_nota': 'Nota de Servicio Relacionado',
      'servicios_relacionados_estado': 'Estado de Servicio Relacionado',
      'trabajadores': 'Trabajadores Asignados',
      'clientes': 'Clientes Asignados',
      'permisos_embarcacion': 'Permisos de Embarcación',
      'embarcacion_creada': 'Embarcación Creada',
      'embarcacion_eliminada': 'Embarcación Eliminada',
      'accion_guardado': 'Acción de Guardado'
    };
    
    return mapaCampos[campo] || campo;
  }

  // Obtener todos los servicios
  getServicios() {
    return this.servicios;
  }

  agregarAcciones(_id: string | null, data: any) {
    return this.http.put(`${this.apiUrl}/agregar-accion/${_id}`, data);
  }

//NUEVO SERVICIO COMENTARIO Y ESTADO


// ✅ CORRECTO
actualizarEstadoComentario(daNumero: string, data: any) {
  return this.http.put<EmbarcacionActualizada>(
    `${this.apiUrl}/estado/da/${daNumero}`,
    data
  );
}

//SERVICIOS DESDE EL BACKEND 


getEstructuraServicios() {
  return this.http.get<any[]>(`${environment.apiUrl}/estructura-servicios`);
}


getServiciosEstructurados() {
  return this.http.get<any[]>(`${environment.apiUrl}/estructura-servicios`);
}

obtenerCantidadEmbarcaciones(): Observable<{ totalEmbarcaciones: number }> {
  return this.http.get<{ totalEmbarcaciones: number }>(
    `${environment.apiUrl}/embarcaciones/reporte-todas-embarcaciones/cantidad`
  );
}

getEmbarcacionesReporteCompleto() {
  return this.http.get<any[]>(
    `${this.apiUrl}/reporte-completo`
  );
}


getEmbarcacionByDaNumero(daNumero: string) {
  return this.http.get<any>(`${environment.apiUrl}/embarcaciones/da/${daNumero}`);
}

// Obtener servicios de una embarcación específica
getServiciosEmbarcacion(daNumero: string) {
  return this.http.get<any>(`${environment.apiUrl}/embarcaciones/${daNumero}/servicios`);
}

// Obtener servicios relacionados de una embarcación
getServiciosRelacionados(daNumero: string) {
  return this.http.get<any>(`${environment.apiUrl}/embarcaciones/${daNumero}/servicios-relacionados`);
}

  
}
