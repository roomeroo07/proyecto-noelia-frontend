import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ContactoService } from '../contactos/contacto.service';
import { EvaluacionService } from '../evaluaciones/evaluacion.service';
import { Contacto } from '../shared/models/contacto.model';
import { Evaluacion } from '../shared/models/evaluacion.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, AfterViewInit {

  @ViewChild('graficaEstados') graficaEstadosRef!: ElementRef;
  @ViewChild('graficaFuentes') graficaFuentesRef!: ElementRef;
  @ViewChild('graficaMeses') graficaMesesRef!: ElementRef;
  @ViewChild('graficaComparativa') graficaComparativaRef!: ElementRef;
  @ViewChild('graficaComparativa2') graficaComparativa2Ref!: ElementRef;

  usuario: any;
  contactos: Contacto[] = [];
  evaluaciones: Evaluacion[] = [];
  cargando = true;

  private graficaEstados?: Chart;
  private graficaFuentes?: Chart;
  private graficaMeses?: Chart;
  private graficaComparativa?: Chart;
  private graficaComparativa2?: Chart;

  constructor(
    private authService: AuthService,
    private contactoService: ContactoService,
    private evaluacionService: EvaluacionService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    Promise.all([
      this.contactoService.getContactos().toPromise(),
      this.evaluacionService.getEvaluaciones().toPromise()
    ]).then(([contactos, evaluaciones]) => {
      this.contactos = contactos || [];
      this.evaluaciones = evaluaciones || [];
      this.cargando = false;
      setTimeout(() => this.crearGraficas(), 100);
    });
  }

  ngAfterViewInit(): void {}

  // Filtra solo los contactos del año actual para las estadísticas
  get contactosAnioActual(): Contacto[] {
    const anio = new Date().getFullYear();
    return this.contactos.filter(c => c.anio === anio);
  }

  crearGraficas(): void {
    this.crearGraficaEstados();
    this.crearGraficaFuentes();
    this.crearGraficaMeses();
    this.crearGraficaComparativa();
  }

  crearGraficaEstados(): void {
    const estados: { [key: string]: number } = {};
    // Usar solo contactos del año actual
    this.contactosAnioActual.forEach(c => {
      if (c.estado) estados[c.estado] = (estados[c.estado] || 0) + 1;
    });

    const colores: { [key: string]: string } = {
      'INCORPORADO/A':          '#bbf7d0',
      'ESPERA':                 '#dbeafe',
      'NO SELECCIONADO/A':      '#f3e8ff',
      'BAJA TRAS CONTRATACIÓN': '#fecaca',
      'NO PRESENTADO/A':        '#ef4444',
      'OFERTA RECHAZADA':       '#ffedd5',
      'OFERTA ACEPTADA':        '#bbf7d0',
      'ENTREVISTA CANCELADA':   '#d6c5a0',
      'NO INTERESADO/A':        '#f1f5f9',
    };

    const labels = Object.keys(estados);
    const data = Object.values(estados);
    const bgColors = labels.map(l => colores[l] || '#e5e7eb');

    if (this.graficaEstados) this.graficaEstados.destroy();
    this.graficaEstados = new Chart(this.graficaEstadosRef.nativeElement, {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: bgColors, borderWidth: 2, borderColor: '#fff' }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: { size: 9 },
              boxWidth: 8,
              padding: 4,
              generateLabels: (chart) => {
                const datasets = chart.data.datasets;
                return chart.data.labels!.map((label, i) => ({
                  text: String(label).length > 18 ? String(label).substring(0, 18) + '...' : String(label),
                  fillStyle: (datasets[0].backgroundColor as string[])[i],
                  strokeStyle: '#fff',
                  lineWidth: 1,
                  index: i,
                  datasetIndex: 0,
                  hidden: false,
                }));
              }
            }
          }
        }
      }
    });
  }

  // Getters unificados con los valores exactos de la BD
  get fichajeTotal(): number {
    return this.contactosAnioActual.filter(c =>
      c.tipo_contacto === 'FICHAJE DIRECTO'
    ).length;
  }

  get fichajeIncorporados(): number {
    return this.contactosAnioActual.filter(c =>
      c.tipo_contacto === 'FICHAJE DIRECTO' && c.estado === 'INCORPORADO/A'
    ).length;
  }

  get fichajeBarras(): number {
    return this.contactosAnioActual.filter(c =>
      c.tipo_contacto === 'FICHAJE DIRECTO' && c.estado === 'BAJA TRAS CONTRATACIÓN'
    ).length;
  }

  get entrevistaTotal(): number {
    return this.contactosAnioActual.filter(c =>
      c.tipo_contacto === 'ENTREVISTA'
    ).length;
  }

  get entrevistaIncorporados(): number {
    return this.contactosAnioActual.filter(c =>
      c.tipo_contacto === 'ENTREVISTA' && c.estado === 'INCORPORADO/A'
    ).length;
  }

  get entrevistaBarras(): number {
    return this.contactosAnioActual.filter(c =>
      c.tipo_contacto === 'ENTREVISTA' && c.estado === 'BAJA TRAS CONTRATACIÓN'
    ).length;
  }

  getPorcentaje(valor: number, total: number): string {
    if (total === 0) return '0%';
    return (valor / total * 100).toFixed(1) + '%';
  }

  crearGraficaComparativa(): void {
    // Usar los getters directamente para garantizar consistencia con los porcentajes
    const fi = this.fichajeIncorporados;
    const fb = this.fichajeBarras;
    const ei = this.entrevistaIncorporados;
    const eb = this.entrevistaBarras;

    const colores = {
      verde: 'rgba(22, 163, 74, 0.7)',
      verdeB: '#16a34a',
      rojo: 'rgba(239, 68, 68, 0.7)',
      rojoB: '#ef4444'
    };

    if (this.graficaComparativa) this.graficaComparativa.destroy();
    this.graficaComparativa = new Chart(this.graficaComparativaRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Incorporados', 'Baja tras contratación'],
        datasets: [{
          data: [fi, fb],
          backgroundColor: [colores.verde, colores.rojo],
          borderColor: [colores.verdeB, colores.rojoB],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 10, padding: 8 } },
          title: { display: true, text: `Fichaje directo (${this.fichajeTotal} total)`, font: { size: 12, weight: 'bold' } },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const total = fi + fb;
                const pct = total > 0 ? (ctx.parsed / total * 100).toFixed(1) : '0';
                return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`;
              }
            }
          }
        }
      }
    });

    if (this.graficaComparativa2) this.graficaComparativa2.destroy();
    this.graficaComparativa2 = new Chart(this.graficaComparativa2Ref.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Incorporados', 'Baja tras contratación'],
        datasets: [{
          data: [ei, eb],
          backgroundColor: [colores.verde, colores.rojo],
          borderColor: [colores.verdeB, colores.rojoB],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 10, padding: 8 } },
          title: { display: true, text: `Entrevista (${this.entrevistaTotal} total)`, font: { size: 12, weight: 'bold' } },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const total = ei + eb;
                const pct = total > 0 ? (ctx.parsed / total * 100).toFixed(1) : '0';
                return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`;
              }
            }
          }
        }
      }
    });
  }

  crearGraficaFuentes(): void {
    const fuentes: { [key: string]: number } = {};
    // Usar solo contactos del año actual
    this.contactosAnioActual.forEach(c => {
      if (c.fuente_reclutamiento) fuentes[c.fuente_reclutamiento] = (fuentes[c.fuente_reclutamiento] || 0) + 1;
    });

    const sorted = Object.entries(fuentes).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const labels = sorted.map(([k]) => k);
    const data = sorted.map(([, v]) => v);

    if (this.graficaFuentes) this.graficaFuentes.destroy();
    this.graficaFuentes = new Chart(this.graficaFuentesRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Candidatos',
          data,
          backgroundColor: 'rgba(176, 92, 122, 0.7)',
          borderColor: 'rgba(176, 92, 122, 1)',
          borderWidth: 1,
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 } } },
          x: { ticks: { font: { size: 9 } } }
        }
      }
    });
  }

  crearGraficaMeses(): void {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const anio = new Date().getFullYear();
    const incorporaciones = new Array(12).fill(0);
    const bajas = new Array(12).fill(0);

    // Usar solo contactos del año actual
    this.contactosAnioActual.forEach(c => {
      if (c.fecha_incorporacion) {
        const f = new Date(c.fecha_incorporacion.substring(0, 10));
        if (f.getFullYear() === anio) incorporaciones[f.getMonth()]++;
      }
      if (c.fecha_baja) {
        const f = new Date(c.fecha_baja.substring(0, 10));
        if (f.getFullYear() === anio) bajas[f.getMonth()]++;
      }
    });

    if (this.graficaMeses) this.graficaMeses.destroy();
    this.graficaMeses = new Chart(this.graficaMesesRef.nativeElement, {
      type: 'line',
      data: {
        labels: meses,
        datasets: [
          {
            label: 'Incorporaciones',
            data: incorporaciones,
            borderColor: '#16a34a',
            backgroundColor: 'rgba(22, 163, 74, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
          },
          {
            label: 'Bajas',
            data: bajas,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { font: { size: 10 } } } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 } } }
        }
      }
    });
  }

  // Estadísticas filtradas por año actual
  get totalCandidatos(): number {
    return this.contactosAnioActual.length;
  }

  get incorporadosMes(): number {
    const hoy = new Date();
    return this.contactosAnioActual.filter(c => {
      if (!c.fecha_incorporacion) return false;
      const f = new Date(c.fecha_incorporacion.substring(0, 10));
      return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear();
    }).length;
  }

  get incorporadosAnio(): number {
    return this.contactosAnioActual.filter(c => c.fecha_incorporacion).length;
  }

  get bajasMes(): number {
    const hoy = new Date();
    return this.contactosAnioActual.filter(c => {
      if (!c.fecha_baja) return false;
      const f = new Date(c.fecha_baja.substring(0, 10));
      return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear();
    }).length;
  }

  get bajasAnio(): number {
    return this.contactosAnioActual.filter(c => c.fecha_baja).length;
  }

  get candidatosEspera(): number {
    return this.contactosAnioActual.filter(c => c.estado === 'ESPERA').length;
  }

  get evaluacionesPendientes(): number {
    return this.evaluaciones.filter(e => e.estado === 'Espera').length;
  }

  get mesActual(): string {
    return new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  }

  get anoActual(): string {
    return new Date().toLocaleDateString('es-ES', { year: 'numeric' });
  }
}