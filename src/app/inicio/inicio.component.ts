import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ContactoService } from '../contactos/contacto.service';
import { EvaluacionService } from '../evaluaciones/evaluacion.service';
import { Contacto } from '../shared/models/contacto.model';
import { Evaluacion } from '../shared/models/evaluacion.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  usuario: any;
  contactos: Contacto[] = [];
  evaluaciones: Evaluacion[] = [];
  cargando = true;

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
    });
  }

  get totalCandidatos(): number {
    return this.contactos.length;
  }

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

  get evaluacionesPendientes(): number {
    return this.evaluaciones.filter(e => e.estado === 'Espera').length;
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
      .slice(0, 5);
  }

  get mesActual(): string {
    return new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  }
}