import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evaluacion } from '../shared/models/evaluacion.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {

  private apiUrl = 'http://localhost:3000/api/evaluaciones';

  constructor(private http: HttpClient) {}

  getEvaluaciones(): Observable<Evaluacion[]> {
    return this.http.get<Evaluacion[]>(this.apiUrl);
  }

  getEvaluacionById(id: number): Observable<Evaluacion> {
    return this.http.get<Evaluacion>(`${this.apiUrl}/${id}`);
  }

  createEvaluacion(evaluacion: Evaluacion): Observable<any> {
    return this.http.post(this.apiUrl, evaluacion);
  }

  updateEvaluacion(id: number, evaluacion: Evaluacion): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, evaluacion);
  }

  deleteEvaluacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}