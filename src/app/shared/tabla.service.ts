import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estado, Sector, Centro, Puesto } from './models/tabla.model';

@Injectable({
  providedIn: 'root'
})
export class TablaService {

  private apiUrl = 'http://localhost:3000/api/tablas';

  constructor(private http: HttpClient) {}

  // Devuelve todos los estados para el desplegable
  getEstados(): Observable<Estado[]> {
  return this.http.get<Estado[]>(`${this.apiUrl}/estados`);
  }

  getCentros(): Observable<Centro[]> {
    return this.http.get<Centro[]>(`${this.apiUrl}/centros`);
  }

  getCentrosBySector(sectorId: number): Observable<Centro[]> {
    return this.http.get<Centro[]>(`${this.apiUrl}/centros/${sectorId}`);
  }

  getPuestos(): Observable<Puesto[]> {
    return this.http.get<Puesto[]>(`${this.apiUrl}/puestos`);
  }

  getSectores(): Observable<Sector[]> {
    return this.http.get<Sector[]>(`${this.apiUrl}/sectores`);
  }
}