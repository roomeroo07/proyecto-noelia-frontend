import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { ProcesosRoutingModule } from './procesos-routing.module';
import { ListaProcesosComponent } from './lista-procesos/lista-procesos.component';
import { FormularioProcesoComponent } from './formulario-proceso/formulario-proceso.component';

@NgModule({
  declarations: [
    ListaProcesosComponent,
    FormularioProcesoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProcesosRoutingModule,
    SharedModule
  ]
})
export class ProcesosModule {}