export interface Proceso {
    id?: number;
    puesto_id?: number;
    puesto?: string;
    centro_id?: number;
    centro?: string;
    sector?: string;
    prioridad?: 'ALTA' | 'MEDIA' | 'BAJA';
    comentario?: string;
}