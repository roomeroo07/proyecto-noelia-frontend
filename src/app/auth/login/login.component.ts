import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // Formulario reactivo con los campos nombre y contraseña, ambos obligatorios
  form: FormGroup;

  // Mensaje de error a mostrar si las credenciales son incorrectas
  errorMsg = '';

  // Indica si se está procesando el login (para deshabilitar el botón)
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  // Se ejecuta al enviar el formulario
  onSubmit(): void {
    if (this.form.invalid) return;

    this.cargando = true;
    this.errorMsg = '';

    const { nombre, contrasena } = this.form.value;

    this.authService.login(nombre, contrasena).subscribe({
      next: () => {
        this.cargando = false;
        // Login correcto, redirige a la lista de contactos
        this.router.navigate(['/contactos']);
      },
      error: () => {
        this.cargando = false;
        this.errorMsg = 'Usuario o contraseña incorrectos';
      }
    });
  }
}