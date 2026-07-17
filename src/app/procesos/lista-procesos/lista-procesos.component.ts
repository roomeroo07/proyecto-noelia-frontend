import { Component, OnInit } from '@angular/core';
import { ProcesoService } from '../proceso.service';
import { Proceso } from '../../shared/models/proceso.model';

@Component({
  selector: 'app-lista-procesos',
  templateUrl: './lista-procesos.component.html',
  styleUrls: ['./lista-procesos.component.css']
})
export class ListaProcesosComponent implements OnInit {

  procesos: Proceso[] = [];
  cargando = true;

  constructor(private procesoService: ProcesoService) {}

  ngOnInit(): void {
    this.cargarProcesos();
  }

  cargarProcesos(): void {
    this.procesoService.getProcesos().subscribe({
      next: (data) => { this.procesos = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  eliminarProceso(id: number): void {
    if (!confirm('¿Eliminar este proceso?')) return;
    this.procesoService.deleteProceso(id).subscribe({
      next: () => this.cargarProcesos()
    });
  }
  getBadgeStyle(prioridad: string | undefined): any {
    const estilos: { [key: string]: any } = {
      'ALTA':  { background: '#fde8e8', color: '#c0392b' },
      'MEDIA': { background: '#fff3e0', color: '#ef6c00' },
      'BAJA':  { background: '#d4edda', color: '#155724' },
    };
    return estilos[prioridad || ''] || { background: '#f0f0f0', color: '#6b7280' };
  }
}