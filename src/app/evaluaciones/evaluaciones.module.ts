import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { EvaluacionesRoutingModule } from './evaluaciones-routing.module';
import { ListaEvaluacionesComponent } from './lista-evaluaciones/lista-evaluaciones.component';
import { FormularioEvaluacionComponent } from './formulario-evaluacion/formulario-evaluacion.component';

@NgModule({
  declarations: [
    ListaEvaluacionesComponent,
    FormularioEvaluacionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    EvaluacionesRoutingModule,
    SharedModule
  ]
})
export class EvaluacionesModule {}