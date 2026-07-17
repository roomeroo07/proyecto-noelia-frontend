import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'replace' })
export class ReplacePipe implements PipeTransform {
  transform(value: string | null, buscar: string, reemplazar: string): string {
    if (!value) return '';
    return value.split(buscar).join(reemplazar);
  }
}