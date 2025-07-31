export interface SolicitudReporte {
    _id?: string;
    id_solicitante:string;
    fecha_solicitud:Date;
    rango_fecha_inicio:Date;
    rango_fecha_fin:Date;
    estado_solicitud:string;
    documento_reporte:string;
}
