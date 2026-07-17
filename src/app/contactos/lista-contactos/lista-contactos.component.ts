import { Component, OnInit } from '@angular/core';
import { ContactoService } from '../contacto.service';
import { Contacto } from '../../shared/models/contacto.model';
import { EvaluacionService } from 'src/app/evaluaciones/evaluacion.service';

@Component({
  selector: 'app-lista-contactos',
  templateUrl: './lista-contactos.component.html',
  styleUrls: ['./lista-contactos.component.css']
})
export class ListaContactosComponent implements OnInit {

  // Lista completa de contactos recibida de la API
  contactos: Contacto[] = [];

  // Lista filtrada que se muestra en la tabla
  contactosFiltrados: Contacto[] = [];

  // Contacto seleccionado para mostrar en el panel lateral
  contactoSeleccionado: Contacto | null = null;

  // Texto del buscador global
  busqueda = '';

  // Filtro de estado activo (se guarda en sessionStorage para persistir)
  filtroEstado = 'Todos';

  // Filtros por columna (tipo contacto, puesto, centro, fuente)
  filtrosColumna: { [key: string]: string } = {};

  // Valores únicos de cada columna para los desplegables de filtro
  valoresUnicos: { [key: string]: string[] } = {};

  // Filtros de rango de fechas
  filtroFechas: {
    fecha_entrevista_desde: string,
    fecha_entrevista_hasta: string,
    fecha_incorporacion_desde: string,
    fecha_incorporacion_hasta: string,
    fecha_baja_desde: string,
    fecha_baja_hasta: string
  } = {
    fecha_entrevista_desde: '',
    fecha_entrevista_hasta: '',
    fecha_incorporacion_desde: '',
    fecha_incorporacion_hasta: '',
    fecha_baja_desde: '',
    fecha_baja_hasta: ''
  };

  // Indica si los datos están cargando
  cargando = true;

  // Estados disponibles para los botones de filtro
  estados = [
    'Todos',
    'INCORPORADO/A',
    'ESPERA',
    'NO SELECCIONADO/A',
    'ENTREVISTA CANCELADA',
    'NO PRESENTADO/A',
    'OFERTA RECHAZADA',
    'OFERTA ACEPTADA',
    'OFERTADO/A',
    'BAJA TRAS CONTRATACIÓN',
    'NO INTERESADO/A'
  ];
  evaluacionesPendientes: number=0;

  constructor(private contactoService: ContactoService, private evaluacionService: EvaluacionService) {}

  ngOnInit(): void {
    // Recuperar el filtro de estado guardado en sesión anterior
    this.filtroEstado = sessionStorage.getItem('filtroEstado') || 'Todos';
    this.cargarContactos();
    this.evaluacionService.getEvaluaciones().subscribe(data => {
      // Contar evaluaciones pendientes (estado 'Enviada' o similar). Ajustado a tipos disponibles.
      this.evaluacionesPendientes = data.filter(e => e.estado === 'Espera').length;
    });
  }

  // Carga todos los contactos desde la API
  cargarContactos(): void {
    this.cargando = true;
    this.contactoService.getContactos().subscribe({
      next: (data) => {
        this.contactos = data;
        this.generarValoresUnicos(data);
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  // Genera los valores únicos de cada columna filtrable para los desplegables
  generarValoresUnicos(data: Contacto[]): void {
    this.valoresUnicos['tipo_contacto'] = [...new Set(
      data.map(c => c.tipo_contacto).filter(v => v)
    )] as string[];
    this.valoresUnicos['puesto'] = [...new Set(
      data.map(c => c.puesto).filter(v => v)
    )] as string[];
    this.valoresUnicos['centro'] = [...new Set(
      data.map(c => c.centro).filter(v => v)
    )] as string[];
    this.valoresUnicos['fuente_reclutamiento'] = [...new Set(
      data.map(c => c.fuente_reclutamiento).filter(v => v)
    )] as string[];
  }

  // Aplica todos los filtros activos simultáneamente
  aplicarFiltros(): void {
    this.contactosFiltrados = this.contactos.filter(c => {
      const coincideTexto = !this.busqueda ||
        c.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        c.puesto?.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        c.centro?.toLowerCase().includes(this.busqueda.toLowerCase());
      const coincideEstado = this.filtroEstado === 'Todos' || c.estado === this.filtroEstado;
      const coincideColumnas = Object.keys(this.filtrosColumna).every(campo => {
        const valor = (c as any)[campo];
        return valor === this.filtrosColumna[campo];
      });
      const coincideFechas = this.comprobarFechas(c);
      return coincideTexto && coincideEstado && coincideColumnas && coincideFechas;
    })
    // Ordenar por id descendente: los últimos añadidos primero
    .sort((a, b) => (b.id || 0) - (a.id || 0));

    this.paginaActual = 1;
    this.actualizarPagina();
  }
  // Comprueba si un contacto cumple los filtros de fecha
  comprobarFechas(c: Contacto): boolean {
    const f = this.filtroFechas;
    const fecha = (v: string | undefined) => v ? v.substring(0, 10) : null;

    if (f.fecha_entrevista_desde || f.fecha_entrevista_hasta) {
      console.log('filtro desde:', f.fecha_entrevista_desde);
      console.log('filtro hasta:', f.fecha_entrevista_hasta);
      console.log('fecha contacto:', fecha(c.fecha_entrevista));
      console.log('comparacion desde:', fecha(c.fecha_entrevista)! < f.fecha_entrevista_desde);
    }

    // Si hay filtro de entrevista y el contacto no tiene fecha, excluirlo
    if (f.fecha_entrevista_desde || f.fecha_entrevista_hasta) {
      if (!fecha(c.fecha_entrevista)) return false;
      if (f.fecha_entrevista_desde && fecha(c.fecha_entrevista)! < f.fecha_entrevista_desde) return false;
      if (f.fecha_entrevista_hasta && fecha(c.fecha_entrevista)! > f.fecha_entrevista_hasta) return false;
    }

    if (f.fecha_incorporacion_desde || f.fecha_incorporacion_hasta) {
      if (!fecha(c.fecha_incorporacion)) return false;
      if (f.fecha_incorporacion_desde && fecha(c.fecha_incorporacion)! < f.fecha_incorporacion_desde) return false;
      if (f.fecha_incorporacion_hasta && fecha(c.fecha_incorporacion)! > f.fecha_incorporacion_hasta) return false;
    }

    if (f.fecha_baja_desde || f.fecha_baja_hasta) {
      if (!fecha(c.fecha_baja)) return false;
      if (f.fecha_baja_desde && fecha(c.fecha_baja)! < f.fecha_baja_desde) return false;
      if (f.fecha_baja_hasta && fecha(c.fecha_baja)! > f.fecha_baja_hasta) return false;
    }

    return true;
  }

  // Se ejecuta al escribir en el buscador
  onBusqueda(texto: string): void {
    this.busqueda = texto;
    this.aplicarFiltros();
  }

  // Se ejecuta al cambiar el filtro de estado — lo guarda en sessionStorage
  onFiltroEstado(estado: string): void {
    this.filtroEstado = estado;
    sessionStorage.setItem('filtroEstado', estado);
    this.aplicarFiltros();
  }

  // Se ejecuta al cambiar un filtro de columna
  onFiltroColumna(campo: string, valor: string): void {
    if (valor === '') {
      delete this.filtrosColumna[campo];
    } else {
      this.filtrosColumna[campo] = valor;
    }
    this.aplicarFiltros();
  }

  // Se ejecuta al cambiar un filtro de fecha
  onFiltroFecha(campo: string, valor: string): void {
    (this.filtroFechas as any)[campo] = valor;
    this.aplicarFiltros();
  }

  // Abre el panel lateral con los datos del contacto seleccionado
  seleccionarContacto(contacto: Contacto): void {
    this.contactoSeleccionado = contacto;
  }

  // Cierra el panel lateral
  cerrarPanel(): void {
    this.contactoSeleccionado = null;
  }

  // Elimina un contacto y recarga la lista
  eliminarContacto(id: number): void {
    if (!confirm('¿Estás segura de que quieres eliminar este candidato?')) return;
    this.contactoService.deleteContacto(id).subscribe({
      next: () => this.cargarContactos()
    });
  }

  // Devuelve el total de contactos por estado para las tarjetas de resumen
  contarPorEstado(estado: string): number {
    return this.contactos.filter(c => c.estado === estado).length;
  }

  // Devuelve el estilo del badge según el estado
  getBadgeStyle(estado: string | undefined): any {
    const estilos: { [key: string]: any } = {
      'NO PRESENTADO/A':        { background: '#ef4444', color: '#ffffff' },
      'ESPERA':                 { background: '#dbeafe', color: '#1d4ed8' },
      'OFERTADO/A':             { background: '#fef9c3', color: '#854d0e' },
      'OFERTA RECHAZADA':       { background: '#ffedd5', color: '#9a3412' },
      'OFERTA ACEPTADA':        { background: '#bbf7d0', color: '#14532d' },
      'INCORPORADO/A':          { background: '#bbf7d0', color: '#14532d' },
      'NO SELECCIONADO/A':      { background: '#f3e8ff', color: '#6b21a8' },
      'ENTREVISTA CANCELADA':   { background: '#d6c5a0', color: '#5c3d11' },
      'BAJA TRAS CONTRATACIÓN': { background: '#fecaca', color: '#7f1d1d' },
      'NO INTERESADO/A':        { background: '#f1f5f9', color: '#475569' },
    };
    return estilos[estado || ''] || { background: '#f0f0f0', color: '#6b7280' };
  }

  // Paginación
  paginaActual = 1;
  registrosPorPagina = 50;
  contactosPaginados: Contacto[] = [];

  get totalPaginas(): number {
    return Math.ceil(this.contactosFiltrados.length / this.registrosPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.actualizarPagina();
  }

  actualizarPagina(): void {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    this.contactosPaginados = this.contactosFiltrados.slice(inicio, fin);
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.filtroEstado = 'Todos';
    this.filtrosColumna = {};
    this.filtroFechas = {
      fecha_entrevista_desde: '',
      fecha_entrevista_hasta: '',
      fecha_incorporacion_desde: '',
      fecha_incorporacion_hasta: '',
      fecha_baja_desde: '',
      fecha_baja_hasta: ''
    };
    sessionStorage.removeItem('filtroEstado');
    // Resetear los inputs de fecha visualmente
    const inputs = document.querySelectorAll('.filtro-fecha-grupo input[type="date"]');
    inputs.forEach((input: any) => input.value = '');
    // Resetear los selects de columna
    const selects = document.querySelectorAll('.th-select') as NodeListOf<HTMLSelectElement>;
    selects.forEach(s => s.value = '');
    this.aplicarFiltros();
  }

  mostrarModalEliminar = false;
  contactoAEliminar: number | null = null;

  confirmarEliminar(id: number, event: Event): void {
    event.stopPropagation();
    this.contactoAEliminar = id;
    this.mostrarModalEliminar = true;
  }

  cancelarEliminar(): void {
    this.mostrarModalEliminar = false;
    this.contactoAEliminar = null;
  }

  ejecutarEliminar(): void {
    if (!this.contactoAEliminar) return;
    this.contactoService.deleteContacto(this.contactoAEliminar).subscribe({
      next: () => {
        this.mostrarModalEliminar = false;
        this.contactoAEliminar = null;
        this.cargarContactos();
      }
    });
  }
  Math = Math;

  // Estadísticas
  get totalCandidatos(): number {
    return this.contactos.length;
  }

  get incorporadosMes(): number {
    const hoy = new Date();
    return this.contactos.filter(c => {
      if (!c.fecha_incorporacion || c.estado !== 'INCORPORADO/A') return false;
      const f = new Date(c.fecha_incorporacion.substring(0, 10));
      return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear();
    }).length;
  }

  get incorporadosAnio(): number {
    const hoy = new Date();
    return this.contactos.filter(c => {
      if (!c.fecha_incorporacion) return false;
      const f = new Date(c.fecha_incorporacion.substring(0, 10));
      return f.getFullYear() === hoy.getFullYear();
    }).length;
  }

  get bajasMes(): number {
    const hoy = new Date();
    return this.contactos.filter(c => {
      if (!c.fecha_baja) return false;
      const f = new Date(c.fecha_baja.substring(0, 10));
      return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear();
    }).length;
  }

  get bajasAnio(): number {
    const hoy = new Date();
    return this.contactos.filter(c => {
      if (!c.fecha_baja) return false;
      const f = new Date(c.fecha_baja.substring(0, 10));
      return f.getFullYear() === hoy.getFullYear();
    }).length;
  }

  get candidatosEspera(): number {
    return this.contactos.filter(c => c.estado === 'ESPERA').length;
  }

  get fuentesPrincipales(): { fuente: string, total: number }[] {
    const mapa: { [key: string]: number } = {};
    this.contactos.forEach(c => {
      if (c.fuente_reclutamiento) {
        mapa[c.fuente_reclutamiento] = (mapa[c.fuente_reclutamiento] || 0) + 1;
      }
    });
    return Object.entries(mapa)
      .map(([fuente, total]) => ({ fuente, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 4);
  }
}