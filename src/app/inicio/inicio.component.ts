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

  usuario: any;
  contactos: Contacto[] = [];
  evaluaciones: Evaluacion[] = []
  cargando = true;

  private graficaEstados?: Chart;
  private graficaFuentes?: Chart;
  private graficaMeses?: Chart;

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

  crearGraficas(): void {
    this.crearGraficaEstados();
    this.crearGraficaFuentes();
    this.crearGraficaMeses();
  }

  crearGraficaEstados(): void {
    const estados: { [key: string]: number } = {};
    this.contactos.forEach(c => {
      if (c.estado) estados[c.estado] = (estados[c.estado] || 0) + 1;
    });

    const colores: { [key: string]: string } = {
      'INCORPORADO/A':        '#bbf7d0',
      'ESPERA':               '#dbeafe',
      'NO SELECCIONADO/A':    '#f3e8ff',
      'BAJA TRAS CONTRATACIÓN': '#fecaca',
      'NO PRESENTADO/A':      '#ef4444',
      'OFERTA RECHAZADA':     '#ffedd5',
      'OFERTA ACEPTADA':      '#bbf7d0',
      'ENTREVISTA CANCELADA': '#d6c5a0',
      'NO INTERESADO/A':      '#f1f5f9',
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
              font: { size: 10 },
              boxWidth: 10,
              padding: 8
            }
          }
        }
      }
    });
  }

  crearGraficaFuentes(): void {
    const fuentes: { [key: string]: number } = {};
    this.contactos.forEach(c => {
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

    this.contactos.forEach(c => {
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

  get totalCandidatos(): number { return this.contactos.length; }

  get incorporadosMes(): number {
    const hoy = new Date();
    return this.contactos.filter(c => {
      if (!c.fecha_incorporacion) return false;
      const f = new Date(c.fecha_incorporacion.substring(0, 10));
      return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear();
    }).length;
  }

  get incorporadosAnio(): number {
    const hoy = new Date();
    return this.contactos.filter(c => {
      if (!c.fecha_incorporacion) return false;
      return new Date(c.fecha_incorporacion.substring(0, 10)).getFullYear() === hoy.getFullYear();
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
      return new Date(c.fecha_baja.substring(0, 10)).getFullYear() === hoy.getFullYear();
    }).length;
  }

  get candidatosEspera(): number {
    return this.contactos.filter(c => c.estado === 'ESPERA').length;
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