import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaEvaluacionesComponent } from './lista-evaluaciones/lista-evaluaciones.component';
import { FormularioEvaluacionComponent } from './formulario-evaluacion/formulario-evaluacion.component';

const routes: Routes = [
  { path: '', component: ListaEvaluacionesComponent },
  { path: 'nuevo', component: FormularioEvaluacionComponent },
  { path: 'editar/:id', component: FormularioEvaluacionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluacionesRoutingModule {}