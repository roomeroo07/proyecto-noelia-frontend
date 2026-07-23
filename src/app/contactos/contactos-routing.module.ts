import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaContactosComponent } from './lista-contactos/lista-contactos.component';
import { FormularioContactoComponent } from './formulario-contacto/formulario-contacto.component';
import { UnsavedChangesGuard } from '../shared/unsaved-changes.guard';

const routes: Routes = [
  { path: '', component: ListaContactosComponent },
  { path: 'nuevo', component: FormularioContactoComponent, canDeactivate: [UnsavedChangesGuard] },
  { path: 'editar/:id', component: FormularioContactoComponent, canDeactivate: [UnsavedChangesGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactosRoutingModule { }
