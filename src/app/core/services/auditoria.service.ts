import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Auditoria {
  usuario: string;
  accion: string;
  entidad: string;
  entidadId: number;
  detalle: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  private apiUrl = `${environment.apiUrl}/auditoria`;

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Auditoria[]> {
    return this.http.get<Auditoria[]>(this.apiUrl);
  }

  filtrar(filtros: any): Observable<Auditoria[]> {

    let params = new HttpParams();

    if (filtros.usuario) params = params.set('usuario', filtros.usuario);
    if (filtros.accion) params = params.set('accion', filtros.accion);
    if (filtros.entidad) params = params.set('entidad', filtros.entidad);
    if (filtros.fechaInicio) params = params.set('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params = params.set('fechaFin', filtros.fechaFin);

    return this.http.get<Auditoria[]>(`${this.apiUrl}/filtrar`, { params });
  }
}