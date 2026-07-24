import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaProcesosComponent } from './lista-procesos/lista-procesos.component';
import { FormularioProcesoComponent } from './formulario-proceso/formulario-proceso.component';
import { UnsavedChangesGuard } from '../shared/unsaved-changes.guard';

const routes: Routes = [
  { path: '', component: ListaProcesosComponent },
  { path: 'nuevo', component: FormularioProcesoComponent, canDeactivate: [UnsavedChangesGuard] },
  { path: 'editar/:id', component: FormularioProcesoComponent, canDeactivate: [UnsavedChangesGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcesosRoutingModule { }