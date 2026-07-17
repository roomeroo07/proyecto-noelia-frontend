import { Component, OnInit } from '@angular/core';
import { EvaluacionService } from '../evaluacion.service';
import { Evaluacion } from '../../shared/models/evaluacion.model';

@Component({
  selector: 'app-lista-evaluaciones',
  templateUrl: './lista-evaluaciones.component.html',
  styleUrls: ['./lista-evaluaciones.component.css']
})
export class ListaEvaluacionesComponent implements OnInit {

  evaluaciones: Evaluacion[] = [];
  evaluacionesFiltradas: Evaluacion[] = [];
  cargando = true;
  busqueda = '';

  // Valores únicos para desplegables de filtro
  valoresUnicos: { [key: string]: string[] } = {};

  // Filtros de columna
  filtrosColumna: { [key: string]: string } = {};

  filtroEstado = '';
  estados = ['Realizada', 'Enviada', 'Espera'];

  // Filtros de fecha incorporación
  filtroFechas: {
    fecha_incorporacion_desde: string,
    fecha_incorporacion_hasta: string,
  } = {
    fecha_incorporacion_desde: '',
    fecha_incorporacion_hasta: '',
  };

  constructor(private evaluacionService: EvaluacionService) {}

  ngOnInit(): void {
    this.cargarEvaluaciones();
  }

  cargarEvaluaciones(): void {
    this.evaluacionService.getEvaluaciones().subscribe({
      next: (data) => {
        this.evaluaciones = data.sort((a, b) => (b.id || 0) - (a.id || 0));
        this.generarValoresUnicos(data);
        this.evaluacionesFiltradas = this.evaluaciones;
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  generarValoresUnicos(data: Evaluacion[]): void {
    this.valoresUnicos['puesto'] = [...new Set(
      data.map(e => e.puesto).filter(v => v)
    )] as string[];
    this.valoresUnicos['centro'] = [...new Set(
      data.map(e => e.centro).filter(v => v)
    )] as string[];
  }

  aplicarFiltros(): void {
    this.evaluacionesFiltradas = this.evaluaciones.filter(e => {

      const coincideTexto = !this.busqueda ||
        e.contacto?.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        e.categoria?.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        e.realizada_por?.toLowerCase().includes(this.busqueda.toLowerCase());

      const coincideColumnas = Object.keys(this.filtrosColumna).every(campo => {
        const valor = (e as any)[campo];
        return valor === this.filtrosColumna[campo];
      });

      const coincideFechas = this.comprobarFechas(e);

      const coincideEstado = !this.filtroEstado || e.estado === this.filtroEstado;

      return coincideTexto && coincideColumnas && coincideFechas && coincideEstado;
    });
  }

  onFiltroEstado(estado: string): void {
    this.filtroEstado = estado;
    this.aplicarFiltros();
  }

  comprobarFechas(e: Evaluacion): boolean {
    const f = this.filtroFechas;
    const fecha = (v: string | undefined) => v ? v.substring(0, 10) : null;

    if (f.fecha_incorporacion_desde || f.fecha_incorporacion_hasta) {
      if (!fecha(e.fecha_incorporacion)) return false;
      if (f.fecha_incorporacion_desde && fecha(e.fecha_incorporacion)! < f.fecha_incorporacion_desde) return false;
      if (f.fecha_incorporacion_hasta && fecha(e.fecha_incorporacion)! > f.fecha_incorporacion_hasta) return false;
    }

    return true;
  }

  onBusqueda(texto: string): void {
    this.busqueda = texto;
    this.aplicarFiltros();
  }

  onFiltroColumna(campo: string, valor: string): void {
    if (valor === '') {
      delete this.filtrosColumna[campo];
    } else {
      this.filtrosColumna[campo] = valor;
    }
    this.aplicarFiltros();
  }

  onFiltroFecha(campo: string, valor: string): void {
    (this.filtroFechas as any)[campo] = valor;
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.filtrosColumna = {};
    this.filtroEstado = '';
    this.filtroFechas = {
      fecha_incorporacion_desde: '',
      fecha_incorporacion_hasta: '',
    };
    const inputs = document.querySelectorAll('.filtro-fecha-grupo input[type="date"]');
    inputs.forEach((input: any) => input.value = '');
    const selects = document.querySelectorAll('.th-select') as NodeListOf<HTMLSelectElement>;
    selects.forEach(s => s.value = '');
    this.aplicarFiltros();
  }

  eliminarEvaluacion(id: number): void {
    if (!confirm('¿Eliminar esta evaluación?')) return;
    this.evaluacionService.deleteEvaluacion(id).subscribe({
      next: () => this.cargarEvaluaciones()
    });
  }

  getBadgeStyle(estado: string | undefined): any {
    const estilos: { [key: string]: any } = {
      'Realizada': { background: '#d4edda', color: '#155724' },
      'Enviada':   { background: '#e0f7fa', color: '#0097a7' },
    };
    return estilos[estado || ''] || { background: '#f0f0f0', color: '#6b7280' };
  }
}