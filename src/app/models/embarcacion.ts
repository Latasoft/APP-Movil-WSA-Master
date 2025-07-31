// Interfaz para una acción, donde la fecha se asigna automáticamente en el backend
export interface IAccion {
  nombre: string;
  fecha: Date;
  comentario?: string;
  incidente: boolean;
}

// Interfaz para un estado (los únicos permitidos son: "puerto", "hotel" y "aeropuerto")
export interface IEstado {
  nombre_estado: 'puerto' | 'hotel' | 'aeropuerto';
  acciones: IAccion[];
}

// Interfaz para el servicio, que contiene el nombre y un arreglo de estados
export interface IServicio {
  nombre_servicio: string;
  estados: IEstado[];
}

// ✅ ✅ ✅ INTERFAZ CORREGIDA
export interface Embarcacion {
  _id?: string;
  titulo_embarcacion: string;
  destino_embarcacion: string;
  fecha_arribo?: Date;
  fecha_zarpe?: Date;
  fecha_estimada_zarpe?: Date;
  da_numero?: string;
  clientes: Array<{
    cliente_id: string;
  }>;
  is_activated: boolean;
  trabajadores: Array<{
    trabajadorId: string;
  }>;
  permisos_embarcacion?: Array<{
    nombre_permiso: string;
  }>;
  servicios?: IServicio[];
}

// ✅ Interfaces adicionales (las tuyas, sin cambios)
export interface ICliente {
  nombre_cliente: string;
}

export interface IPermisoEmbarcacion {
  _id: string;
  nombre_permiso: string;
}

export interface IEmbarcacion {
  _id: string;
  titulo_embarcacion: string;
  destino_embarcacion: string;
  cliente_id: ICliente;
  clientes?: {
    cliente_id: {
      nombre_cliente: string;
    };
  }[];
  permisos_embarcacion: IPermisoEmbarcacion[];
  is_activated?: boolean;
  estado_actual?: string;
  comentario_general?: string;
  servicio?: string;
  subservicio?: string;
  servicio_relacionado?: string;
  fecha_servicio_relacionado?: string;
  nota_servicio_relacionado?: string;
  eta?: string;
  etb?: string;
  etd?: string;
  fecha_arribo?: string | Date;
  fecha_zarpe?: string | Date;
  fecha_estimada_zarpe?: string;
  servicios_relacionados?: {
    nombre: string;
    fecha: string;
    nota?: string;
    estado?: string;
  }[];
  da_numero?: string;
}

export interface IGetEmbarcacionResponse {
  message: string;
  data: IEmbarcacion[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface EmbarcacionActualizada {
  _id: string;
  estado_actual: string;
  comentario_general: string;
  servicio?: string;
  subservicio?: string;
  servicio_relacionado: string;
  fecha_servicio_relacionado?: string;
  nota_servicio_relacionado?: string;
  fecha_estimada_zarpe?: string;
  eta?: string;
  etb?: string;
  etd?: string;
  fecha_arribo?: string;
  fecha_zarpe?: string;
  servicios_relacionados?: {
    nombre: string;
    fecha: string;
    nota?: string;
    estado?: string;
  }[];
}
