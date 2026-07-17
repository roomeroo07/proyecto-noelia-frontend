import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/contactos', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'contactos',
    loadChildren: () => import('./contactos/contactos.module').then(m => m.ContactosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'procesos',
    loadChildren: () => import('./procesos/procesos.module').then(m => m.ProcesosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'evaluaciones',
    loadChildren: () => import('./evaluaciones/evaluaciones.module').then(m => m.EvaluacionesModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
