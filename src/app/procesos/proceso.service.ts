import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proceso } from '../shared/models/proceso.model';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {

  private apiUrl = 'http://localhost:3000/api/procesos';

  constructor(private http: HttpClient) {}

  getProcesos(): Observable<Proceso[]> {
    return this.http.get<Proceso[]>(this.apiUrl);
  }

  getProcesoById(id: number): Observable<Proceso> {
    return this.http.get<Proceso>(`${this.apiUrl}/${id}`);
  }

  createProceso(proceso: Proceso): Observable<any> {
    return this.http.post(this.apiUrl, proceso);
  }

  updateProceso(id: number, proceso: Proceso): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, proceso);
  }

  deleteProceso(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}