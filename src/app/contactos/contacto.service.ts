import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contacto } from '../shared/models/contacto.model';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private apiUrl = 'http://localhost:3000/api/contactos';

  constructor(private http: HttpClient) {}

  // Obtiene todos los contactos
  getContactos(): Observable<Contacto[]> {
    return this.http.get<Contacto[]>(this.apiUrl);
  }

  // Obtiene un contacto por id
  getContactoById(id: number): Observable<Contacto> {
    return this.http.get<Contacto>(`${this.apiUrl}/${id}`);
  }

  // Crea un nuevo contacto
  createContacto(contacto: Contacto): Observable<any> {
    return this.http.post(this.apiUrl, contacto);
  }

  // Actualiza un contacto existente
  updateContacto(id: number, contacto: Contacto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, contacto);
  }

  // Elimina un contacto
  deleteContacto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getContactosIncorporados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/incorporados`);
  }
}