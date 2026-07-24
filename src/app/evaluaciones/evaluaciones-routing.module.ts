import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaEvaluacionesComponent } from './lista-evaluaciones/lista-evaluaciones.component';
import { FormularioEvaluacionComponent } from './formulario-evaluacion/formulario-evaluacion.component';
import { UnsavedChangesGuard } from '../shared/unsaved-changes.guard';

const routes: Routes = [
  { path: '', component: ListaEvaluacionesComponent },
  { path: 'nuevo', component: FormularioEvaluacionComponent, canDeactivate: [UnsavedChangesGuard] },
  { path: 'editar/:id', component: FormularioEvaluacionComponent, canDeactivate: [UnsavedChangesGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluacionesRoutingModule {}