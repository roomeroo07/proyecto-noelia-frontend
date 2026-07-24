import { Component, OnInit } from '@angular/core';
import { ConfiguracionService } from '../configuracion.service';

@Component({
  selector: 'app-lista-centros',
  templateUrl: './lista-centros.component.html',
  styleUrls: ['./lista-centros.component.css']
})
export class ListaCentrosComponent implements OnInit {

  centros: any[] = [];
  centrosFiltrados: any[] = [];
  busqueda = '';
  cargando = true;
  mostrarModal = false;
  centroAEliminar: number | null = null;

  constructor(private configuracionService: ConfiguracionService) {}

  ngOnInit(): void {
    this.cargarCentros();
  }

  cargarCentros(): void {
    this.configuracionService.getCentros().subscribe({
      next: (data) => {
        this.centros = data;
        this.centrosFiltrados = data;
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  onBusqueda(texto: string): void {
    this.busqueda = texto;
    this.centrosFiltrados = this.centros.filter(c =>
      c.nombre.toLowerCase().includes(texto.toLowerCase()) ||
      c.sector?.toLowerCase().includes(texto.toLowerCase())
    );
  }

  confirmarEliminar(id: number, event: Event): void {
    event.stopPropagation();
    this.centroAEliminar = id;
    this.mostrarModal = true;
  }

  cancelarEliminar(): void {
    this.mostrarModal = false;
    this.centroAEliminar = null;
  }

  ejecutarEliminar(): void {
    if (!this.centroAEliminar) return;
    this.configuracionService.deleteCentro(this.centroAEliminar).subscribe({
      next: () => {
        this.mostrarModal = false;
        this.centroAEliminar = null;
        this.cargarCentros();
      },
      error: () => alert('No se puede eliminar — hay candidatos asignados a este centro')
    });
  }
}