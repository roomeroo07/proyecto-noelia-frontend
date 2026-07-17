import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL base de la API
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  // Llama al endpoint POST /api/auth/login
  // Si es correcto guarda el token y los datos del usuario en localStorage
  login(nombre: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { nombre, contrasena }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify({ nombre: res.nombre, tipo: res.tipo }));
      })
    );
  }

  // Elimina el token y redirige al login
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  // Comprueba si hay token guardado (usuario logueado)
isLoggedIn(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;

  // Comprueba si el token ha expirado leyendo el payload
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const ahora = Math.floor(Date.now() / 1000);
    return payload.exp > ahora;
  } catch {
    return false;
  }
}

  // Devuelve los datos del usuario logueado
  getUsuario(): any {
    const u = localStorage.getItem('usuario');
    return u ? JSON.parse(u) : null;
  }
}