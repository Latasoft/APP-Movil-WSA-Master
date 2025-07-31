export interface RegistroSolicutudReporte {
    _id?: string;
    id_solicitante: string;
    fecha_descarga?: Date;
    rango_fecha_inicio: Date;
    rango_fecha_termino: Date;
    
}


export interface RegistroDescargaResponse {
    message: string;
    solicitud: DescargaReporteUser[];
    totalSolicitudes: number;
    totalPages: number;
    currentPage: number;
  }
  
  export interface DescargaReporteUser {
    _id: string;
    solicitante: {
      username: string;
    } | null;
    rango_fecha_inicio: string; // o Date si prefieres después parsearlo
    rango_fecha_termino: string;
    fecha_descarga: string;
  }
  