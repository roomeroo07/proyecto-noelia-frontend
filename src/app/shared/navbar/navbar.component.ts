import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  usuario: any;
  fechaHoy: string;

  constructor(private authService: AuthService) {
    this.usuario = this.authService.getUsuario();
    this.fechaHoy = new Date().toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
  }

  logout(): void {
    this.authService.logout();
  }
}