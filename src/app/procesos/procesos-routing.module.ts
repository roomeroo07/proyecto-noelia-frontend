import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaProcesosComponent } from './lista-procesos/lista-procesos.component';
import { FormularioProcesoComponent } from './formulario-proceso/formulario-proceso.component';

const routes: Routes = [
  { path: '', component: ListaProcesosComponent },
  { path: 'nuevo', component: FormularioProcesoComponent },
  { path: 'editar/:id', component: FormularioProcesoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcesosRoutingModule { }