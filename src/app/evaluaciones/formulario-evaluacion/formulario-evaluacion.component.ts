import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluacionService } from '../evaluacion.service';
import { ContactoService } from '../../contactos/contacto.service';
import { TablaService } from '../../shared/tabla.service';
import { Contacto } from '../../shared/models/contacto.model';
import { Centro, Puesto } from '../../shared/models/tabla.model';
import { PuedeDesactivar } from 'src/app/shared/unsaved-changes.guard';

@Component({
  selector: 'app-formulario-evaluacion',
  templateUrl: './formulario-evaluacion.component.html',
  styleUrls: ['./formulario-evaluacion.component.css']
})
export class FormularioEvaluacionComponent implements OnInit, PuedeDesactivar {

  form: FormGroup;
  esEdicion = false;
  evaluacionId: number | null = null;
  cargando = false;
  errorMsg = '';

  contactos: Contacto[] = [];
  puestos: Puesto[] = [];
  centros: Centro[] = [];
  estados = ['Realizada', 'Enviada'];

  tieneCambiosSinGuardar(): boolean {
    return this.form.dirty && !this.cargando;
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.form.dirty && !this.cargando) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  constructor(
    private fb: FormBuilder,
    private evaluacionService: EvaluacionService,
    private contactoService: ContactoService,
    private tablaService: TablaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      contacto_id:              [''],
      categoria:                [''],
      centro_id:                [''],
      fecha_incorporacion:      [''],
      fecha_evaluacion_inicio:  [''],
      fecha_evaluacion_3meses:  [''],
      estado:                   [''],
      realizada_por:            [''],
      fecha_baja:               ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    Promise.all([
      // En edición cargamos todos los contactos, en creación solo los incorporados
      id ? this.contactoService.getContactos().toPromise() 
        : this.contactoService.getContactosIncorporados().toPromise(),
      this.tablaService.getPuestos().toPromise(),
      this.tablaService.getCentros().toPromise()
    ]).then(([contactos, puestos, centros]) => {
      this.contactos = contactos || [];
      this.puestos = puestos || [];
      this.centros = centros || [];

      if (id) {
        this.esEdicion = true;
        this.evaluacionId = +id;
        this.evaluacionService.getEvaluacionById(this.evaluacionId).subscribe({
          next: (e) => {
            const fixFecha = (f: string | undefined) => f ? f.substring(0, 10) : '';
            this.form.patchValue({
              contacto_id:              e.contacto_id,
              categoria:                e.categoria || '',
              centro_id:                e.centro_id || '',
              fecha_incorporacion:      fixFecha(e.fecha_incorporacion),
              fecha_evaluacion_inicio:  fixFecha(e.fecha_evaluacion_inicio),
              fecha_evaluacion_3meses:  fixFecha(e.fecha_evaluacion_3meses),
              estado:                   e.estado || '',
              realizada_por:            e.realizada_por || '',
              fecha_baja:               fixFecha(e.fecha_baja),
            });
          }
        });
      }
    });
  }

  onSubmit(): void {
    this.cargando = true;
    const n = (v: any) => (v === '' || v === undefined) ? null : v;
    const datos = {
      contacto_id:              n(this.form.value.contacto_id),
      categoria:                n(this.form.value.categoria),
      centro_id:                n(this.form.value.centro_id),
      fecha_incorporacion:      n(this.form.value.fecha_incorporacion),
      fecha_evaluacion_inicio:  n(this.form.value.fecha_evaluacion_inicio),
      fecha_evaluacion_3meses:  n(this.form.value.fecha_evaluacion_3meses),
      estado:                   n(this.form.value.estado),
      realizada_por:            n(this.form.value.realizada_por),
      fecha_baja:               n(this.form.value.fecha_baja)
    };

    if (this.esEdicion && this.evaluacionId) {
      this.evaluacionService.updateEvaluacion(this.evaluacionId, datos).subscribe({
        next: () => this.router.navigate(['/evaluaciones']),
        error: () => { this.cargando = false; this.errorMsg = 'Error al actualizar'; }
      });
    } else {
      this.evaluacionService.createEvaluacion(datos).subscribe({
        next: () => this.router.navigate(['/evaluaciones']),
        error: () => { this.cargando = false; this.errorMsg = 'Error al crear'; }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/evaluaciones']);
  }
}