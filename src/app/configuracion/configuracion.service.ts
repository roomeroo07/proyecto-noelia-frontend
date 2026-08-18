import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfiguracionService {

  private apiUrl = 'http://192.168.1.166:3000/api/configuracion';

  constructor(private http: HttpClient) {}

  getCentros(): Observable<any[]> { return this.http.get<any[]>(`${this.apiUrl}/centros`); }
  createCentro(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/centros`, data); }
  updateCentro(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/centros/${id}`, data); }
  deleteCentro(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/centros/${id}`); }

  getPuestos(): Observable<any[]> { return this.http.get<any[]>(`${this.apiUrl}/puestos`); }
  createPuesto(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/puestos`, data); }
  updatePuesto(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/puestos/${id}`, data); }
  deletePuesto(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/puestos/${id}`); }
}