import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fecha' })
export class FechaPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '—';
    // Cogemos solo los primeros 10 caracteres YYYY-MM-DD
    // y construimos la fecha SIN conversión de zona horaria
    const s = value.substring(0, 10);
    const [year, month, day] = s.split('-').map(Number);
    // Usamos Date.UTC para evitar cualquier conversión de zona horaria local
    const d = new Date(year, month - 1, day, 12, 0, 0);
    return d.toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }
}