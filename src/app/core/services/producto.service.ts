import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  // =========================
  // OBTENER TODOS
  // =========================
  obtenerTodos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  // =========================
  // OBTENER POR ID
  // =========================
  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  // =========================
  // CREAR
  // =========================
  crear(formData: FormData) {
  return this.http.post<Producto>(this.apiUrl, formData);
}

  // =========================
  // ACTUALIZAR
  // =========================
actualizar(id: number, formData: FormData) {
  return this.http.put<Producto>(
    `${this.apiUrl}/${id}`,
    formData
  );
}

  // =========================
  // DESACTIVAR (DELETE)
  // =========================
  desactivar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // =========================
  // ELIMINAR DEFINITIVO
  // =========================
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/definitivo/${id}`);
  }

  // =========================
  // FILTRAR POR CATEGORÍA
  // =========================
  obtenerPorCategoria(categoriaId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/categoria/${categoriaId}`);
  }
}