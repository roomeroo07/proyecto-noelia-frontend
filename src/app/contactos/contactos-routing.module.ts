import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaContactosComponent } from './lista-contactos/lista-contactos.component';
import { FormularioContactoComponent } from './formulario-contacto/formulario-contacto.component';

const routes: Routes = [
  { path: '', component: ListaContactosComponent },
  { path: 'nuevo', component: FormularioContactoComponent },
  { path: 'editar/:id', component: FormularioContactoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactosRoutingModule { }
