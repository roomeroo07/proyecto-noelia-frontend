import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcesoService } from '../proceso.service';
import { TablaService } from '../../shared/tabla.service';
import { Centro, Puesto } from '../../shared/models/tabla.model';

@Component({
  selector: 'app-formulario-proceso',
  templateUrl: './formulario-proceso.component.html',
  styleUrls: ['./formulario-proceso.component.css']
})
export class FormularioProcesoComponent implements OnInit {

  form: FormGroup;
  esEdicion = false;
  procesoId: number | null = null;
  cargando = false;
  errorMsg = '';

  centros: Centro[] = [];
  puestos: Puesto[] = [];
  prioridades = ['ALTA', 'MEDIA', 'BAJA'];

  constructor(
    private fb: FormBuilder,
    private procesoService: ProcesoService,
    private tablaService: TablaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      puesto_id:  [''],
      centro_id:  [''],
      prioridad:  [''],
      comentario: ['']
    });
  }

  ngOnInit(): void {
    this.tablaService.getCentros().subscribe(d => this.centros = d);
    this.tablaService.getPuestos().subscribe(d => this.puestos = d);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.procesoId = +id;
      this.procesoService.getProcesoById(this.procesoId).subscribe({
        next: (p) => this.form.patchValue(p)
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.cargando = true;
    const datos = this.form.value;

    if (this.esEdicion && this.procesoId) {
      this.procesoService.updateProceso(this.procesoId, datos).subscribe({
        next: () => this.router.navigate(['/procesos']),
        error: () => { this.cargando = false; this.errorMsg = 'Error al actualizar'; }
      });
    } else {
      this.procesoService.createProceso(datos).subscribe({
        next: () => this.router.navigate(['/procesos']),
        error: () => { this.cargando = false; this.errorMsg = 'Error al crear'; }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/procesos']);
  }
}