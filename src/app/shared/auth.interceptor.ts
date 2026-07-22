import { Injectable } from '@angular/core';
import {
  HttpRequest, HttpHandler, HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private refrescando = false;
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    if (token) {
      request = this.añadirToken(request, token);
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.manejarError401(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private añadirToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  private manejarError401(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.refrescando) {
      return this.tokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.añadirToken(request, token!)))
      );
    }

    this.refrescando = true;
    this.tokenSubject.next(null);

    return this.authService.refreshToken().pipe(
      switchMap((res: any) => {
        this.refrescando = false;
        this.tokenSubject.next(res.token);
        return next.handle(this.añadirToken(request, res.token));
      }),
      catchError(err => {
        // Si el refresh falla, redirige al login
        this.refrescando = false;
        this.authService.logout();
        return throwError(() => err);
      })
    );
  }
}