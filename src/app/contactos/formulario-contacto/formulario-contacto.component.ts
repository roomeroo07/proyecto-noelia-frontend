import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactoService } from '../contacto.service';
import { TablaService } from '../../shared/tabla.service';
import { Estado, Centro, Puesto } from '../../shared/models/tabla.model';

@Component({
  selector: 'app-formulario-contacto',
  templateUrl: './formulario-contacto.component.html',
  styleUrls: ['./formulario-contacto.component.css']
})
export class FormularioContactoComponent implements OnInit {

  form: FormGroup;
  esEdicion = false;
  contactoId: number | null = null;
  cargando = false;
  errorMsg = '';

  // Datos para los desplegables, cargados desde la API
  estados: Estado[] = [];
  centros: Centro[] = [];
  puestos: Puesto[] = [];

  tiposContacto = ['TELEFONICO', 'EMAIL', 'ENTREVISTA', 'FICHAJE DIRECTO'];
  disponibilidades = ['Completa', 'Mañanas', 'Tardes', 'Fines de semana', 'Jornada parcial'];
  fuentesReclutamiento = [
    'CV EN MANO EN OFICINA', 'CV EN MANO EN LOCAL', 'EMAIL',
    'INDEED', 'INFOJOBS', 'RECOMENDACIÓN', 'WEB', 'TURIJOBS',
    'LINKEDIN', 'BÚSQUEDA ACTIVA', 'WHATSAPP'
  ];

  constructor(
    private fb: FormBuilder,
    private contactoService: ContactoService,
    private tablaService: TablaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      tipo_contacto: [''],
      fecha_nacimiento: [''],
      telefono: [''],
      residencia: [''],
      email: ['', Validators.email],
      carnet_conducir: [''],
      fecha_primer_contacto: [''],
      fecha_entrevista: [''],
      email_entrevista_presencial: [false],
      email_candidatura_desestimada: [false],
      disponibilidad_horaria: [''],
      informacion: [''],
      descripcion_perfil: [''],
      formacion: [''],
      experiencia: [''],
      puesto_id: [''],
      centro_id: [''],
      estado_id: [''],
      fecha_incorporacion: [''],
      fecha_baja: [''],
      motivo_baja: [''],
      fuente_reclutamiento: [''],
      referenciado_por: [''],
      historial: ['']
    });
  }

  ngOnInit(): void {
    // Carga los catálogos para los desplegables
    this.tablaService.getEstados().subscribe(d => this.estados = d);
    this.tablaService.getCentros().subscribe(d => this.centros = d);
    this.tablaService.getPuestos().subscribe(d => this.puestos = d);

    // Comprueba si estamos en modo edición (hay :id en la URL)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.contactoId = +id;
      this.cargarContacto(this.contactoId);
    }
  }

  // Carga los datos del contacto existente y rellena el formulario
  cargarContacto(id: number): void {
    this.contactoService.getContactoById(id).subscribe({
      next: (contacto) => {
        const fixFecha = (f: string | undefined) => f ? f.substring(0, 10) : '';
        this.form.patchValue({
          ...contacto,
          fecha_nacimiento:      fixFecha(contacto.fecha_nacimiento),
          fecha_primer_contacto: fixFecha(contacto.fecha_primer_contacto),
          fecha_entrevista:      fixFecha(contacto.fecha_entrevista),
          fecha_incorporacion:   fixFecha(contacto.fecha_incorporacion),
          fecha_baja:            fixFecha(contacto.fecha_baja),
        });
      },
      error: () => this.errorMsg = 'Error al cargar el contacto'
    });
  }

 onSubmit(): void {
    if (this.form.invalid) return;
    this.cargando = true;

    // Corrige el desfase de zona horaria en todas las fechas
    const fixFecha = (f: string) => {
      if (!f) return null;
      return f.substring(0, 10); // Asegura formato YYYY-MM-DD sin hora
    };

    const datos = {
      ...this.form.value,
      fecha_nacimiento:        fixFecha(this.form.value.fecha_nacimiento),
      fecha_primer_contacto:   fixFecha(this.form.value.fecha_primer_contacto),
      fecha_entrevista:        fixFecha(this.form.value.fecha_entrevista),
      fecha_incorporacion:     fixFecha(this.form.value.fecha_incorporacion),
      fecha_baja:              fixFecha(this.form.value.fecha_baja),
    };

    if (this.esEdicion && this.contactoId) {
      this.contactoService.updateContacto(this.contactoId, datos).subscribe({
        next: () => this.router.navigate(['/contactos']),
        error: () => { this.cargando = false; this.errorMsg = 'Error al actualizar'; }
      });
    } else {
      this.contactoService.createContacto(datos).subscribe({
        next: () => this.router.navigate(['/contactos']),
        error: () => { this.cargando = false; this.errorMsg = 'Error al crear el contacto'; }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/contactos']);
  }
}