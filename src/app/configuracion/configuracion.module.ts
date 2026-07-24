import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ListaCentrosComponent } from './lista-centros/lista-centros.component';
import { FormularioCentroComponent } from './formulario-centro/formulario-centro.component';
import { ListaPuestosComponent } from './lista-puestos/lista-puestos.component';
import { FormularioPuestoComponent } from './formulario-puesto/formulario-puesto.component';

@NgModule({
  declarations: [
    ListaCentrosComponent, FormularioCentroComponent,
    ListaPuestosComponent, FormularioPuestoComponent
  ],
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    ConfiguracionRoutingModule, SharedModule
  ]
})
export class ConfiguracionModule {}