export interface HistorialCambio {
  _id?: string;
  usuario_id: string;
  usuario_nombre?: string;
  entidad_tipo: 'embarcacion' | 'usuario' | 'cliente' | 'servicio';
  entidad_id: string;
  entidad_nombre?: string;
  accion: 'crear' | 'editar' | 'eliminar' | 'activar' | 'desactivar';
  campos_modificados: CampoModificado[];
  fecha_cambio: Date;
  ip_usuario?: string;
  user_agent?: string;
}

export interface CampoModificado {
  campo: string;
  valor_anterior: any;
  valor_nuevo: any;
  tipo_campo?: string;
  accion?: 'agregado' | 'eliminado';
  contexto?: string;
}

export interface HistorialCambiosResponse {
  message: string;
  historial: HistorialCambioDetallado[];
  totalRegistros: number;
  totalPages: number;
  currentPage: number;
}

export interface HistorialCambioDetallado {
  _id: string;
  usuario: {
    username: string;
    email?: string;
  } | null;
  entidad_tipo: string;
  entidad_id: string;
  entidad_nombre: string;
  accion: string;
  campos_modificados: CampoModificado[];
  fecha_cambio: string;
  ip_usuario?: string;
}

export interface FiltrosHistorial {
  usuario_id?: string;
  entidad_tipo?: string;
  entidad_id?: string;
  accion?: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  page?: number;
  limit?: number;
}