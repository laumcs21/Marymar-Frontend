import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from '../models/persona.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private apiUrl = `${environment.apiUrl}/personas`;

  constructor(private http: HttpClient) {}

  obtenerTodas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.apiUrl);
  }

  crear(persona: any): Observable<Persona> {
    return this.http.post<Persona>(this.apiUrl, persona);
  }

  actualizar(id: number, persona: any): Observable<Persona> {
    return this.http.put<Persona>(`${this.apiUrl}/${id}`, persona);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
