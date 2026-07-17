import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ContactosRoutingModule } from './contactos-routing.module';
import { ListaContactosComponent } from './lista-contactos/lista-contactos.component';
import { FormularioContactoComponent } from './formulario-contacto/formulario-contacto.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ListaContactosComponent,
    FormularioContactoComponent
  ],
  imports: [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  ContactosRoutingModule,
  SharedModule
  ]
})
export class ContactosModule {}