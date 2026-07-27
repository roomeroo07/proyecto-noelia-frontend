import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfiguracionService } from '../configuracion.service';
import { TablaService } from '../../shared/tabla.service';

@Component({
  selector: 'app-formulario-centro',
  templateUrl: './formulario-centro.component.html',
  styleUrls: ['./formulario-centro.component.css']
})
export class FormularioCentroComponent implements OnInit {

  form: FormGroup;
  esEdicion = false;
  centroId: number | null = null;
  cargando = false;
  errorMsg = '';
  sectores: any[] = [];

  constructor(
    private fb: FormBuilder,
    private configuracionService: ConfiguracionService,
    private tablaService: TablaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre:    ['', Validators.required],
      sector_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.tablaService.getSectores().subscribe(d => this.sectores = d);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.centroId = +id;
      this.configuracionService.getCentros().subscribe(centros => {
        const centro = centros.find(c => c.id === this.centroId);
        if (centro) this.form.patchValue(centro);
      });
    }
  }

  onSubmit(): void {
    console.log('Form valid:', this.form.valid);
    console.log('Form value:', this.form.value);
    if (this.form.invalid) return;
    this.cargando = true;

    if (this.esEdicion && this.centroId) {
      this.configuracionService.updateCentro(this.centroId, this.form.value).subscribe({
        next: () => this.router.navigate(['/configuracion/centros']),
        error: () => { this.cargando = false; this.errorMsg = 'Error al actualizar'; }
      });
    } else {
      this.configuracionService.createCentro(this.form.value).subscribe({
        next: () => this.router.navigate(['/configuracion/centros']),
        error: () => { this.cargando = false; this.errorMsg = 'Error al crear'; }
      });
    }
    alert('Centro guardado con éxito');
  }

  cancelar(): void {
    this.router.navigate(['/configuracion/centros']);
  }
}