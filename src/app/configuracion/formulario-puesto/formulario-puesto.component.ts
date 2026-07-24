import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfiguracionService } from '../configuracion.service';

@Component({
  selector: 'app-formulario-puesto',
  templateUrl: './formulario-puesto.component.html',
  styleUrls: ['./formulario-puesto.component.css']
})
export class FormularioPuestoComponent implements OnInit {

  form: FormGroup;
  esEdicion = false;
  puestoId: number | null = null;
  cargando = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private configuracionService: ConfiguracionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.puestoId = +id;
      this.configuracionService.getPuestos().subscribe(puestos => {
        const puesto = puestos.find(p => p.id === this.puestoId);
        if (puesto) this.form.patchValue(puesto);
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.cargando = true;

    if (this.esEdicion && this.puestoId) {
      this.configuracionService.updatePuesto(this.puestoId, this.form.value).subscribe({
        next: () => this.router.navigate(['/configuracion/puestos']),
        error: () => { this.cargando = false; this.errorMsg = 'Error al actualizar'; }
      });
    } else {
      this.configuracionService.createPuesto(this.form.value).subscribe({
        next: () => this.router.navigate(['/configuracion/puestos']),
        error: () => { this.cargando = false; this.errorMsg = 'Error al crear'; }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/configuracion/puestos']);
  }
}