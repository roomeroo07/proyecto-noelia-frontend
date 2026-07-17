import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtiene el token guardado en localStorage tras el login
    const token = localStorage.getItem('token');

    // Si hay token, clona la petición añadiendo la cabecera Authorization
    // Así no hay que añadirlo manualmente en cada llamada a la API
    if (token) {
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authRequest);
    }

    // Si no hay token (usuario no logueado), deja pasar la petición sin modificar
    return next.handle(request);
  }
}