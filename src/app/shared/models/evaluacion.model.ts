export interface Evaluacion {
  id?: number;
  contacto_id: number;
  contacto?: string;
  categoria?: string;
  centro_id?: number;
  centro?: string;
  puesto?: string;
  fecha_incorporacion?: string;
  fecha_evaluacion_inicio?: string;
  fecha_evaluacion_3meses?: string;
  estado?: 'Realizada' | 'Enviada' | 'Espera';
  realizada_por?: string;
  evaluador?: string;
  fecha_baja?: string;
  estado_contacto?: string;
}