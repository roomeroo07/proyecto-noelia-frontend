import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface PuedeDesactivar {
  tieneCambiosSinGuardar(): boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<PuedeDesactivar> {
  canDeactivate(component: PuedeDesactivar): boolean | Observable<boolean> {
    if (component.tieneCambiosSinGuardar()) {
      return confirm('Tienes cambios sin guardar. ¿Estás segura de que quieres salir?');
    }
    return true;
  }
}