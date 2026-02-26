import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  obtenerTodas(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  crear(categoria: any): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  actualizar(id: number, categoria: any): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}