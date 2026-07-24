import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaCentrosComponent } from './lista-centros/lista-centros.component';
import { FormularioCentroComponent } from './formulario-centro/formulario-centro.component';
import { ListaPuestosComponent } from './lista-puestos/lista-puestos.component';
import { FormularioPuestoComponent } from './formulario-puesto/formulario-puesto.component';

const routes: Routes = [
  { path: 'centros',           component: ListaCentrosComponent },
  { path: 'centros/nuevo',     component: FormularioCentroComponent },
  { path: 'centros/editar/:id', component: FormularioCentroComponent },
  { path: 'puestos',           component: ListaPuestosComponent },
  { path: 'puestos/nuevo',     component: FormularioPuestoComponent },
  { path: 'puestos/editar/:id', component: FormularioPuestoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule {}