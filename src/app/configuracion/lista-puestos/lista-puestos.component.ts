import { Component, OnInit } from '@angular/core';
import { ConfiguracionService } from '../configuracion.service';

@Component({
  selector: 'app-lista-puestos',
  templateUrl: './lista-puestos.component.html',
  styleUrls: ['./lista-puestos.component.css']
})
export class ListaPuestosComponent implements OnInit {

  puestos: any[] = [];
  puestosFiltrados: any[] = [];
  busqueda = '';
  cargando = true;
  mostrarModal = false;
  puestoAEliminar: number | null = null;

  constructor(private configuracionService: ConfiguracionService) {}

  ngOnInit(): void {
    this.cargarPuestos();
  }

  cargarPuestos(): void {
    this.configuracionService.getPuestos().subscribe({
      next: (data) => {
        this.puestos = data;
        this.puestosFiltrados = data;
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  onBusqueda(texto: string): void {
    this.busqueda = texto;
    this.puestosFiltrados = this.puestos.filter(p =>
      p.descripcion.toLowerCase().includes(texto.toLowerCase())
    );
  }

  confirmarEliminar(id: number, event: Event): void {
    event.stopPropagation();
    this.puestoAEliminar = id;
    this.mostrarModal = true;
  }

  cancelarEliminar(): void {
    this.mostrarModal = false;
    this.puestoAEliminar = null;
  }

  ejecutarEliminar(): void {
    if (!this.puestoAEliminar) return;
    this.configuracionService.deletePuesto(this.puestoAEliminar).subscribe({
      next: () => {
        this.mostrarModal = false;
        this.puestoAEliminar = null;
        this.cargarPuestos();
      },
      error: () => alert('No se puede eliminar — hay candidatos asignados a este puesto')
    });
  }
}