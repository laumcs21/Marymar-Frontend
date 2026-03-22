import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mesa } from '../models/mesa.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

    private apiUrl = `${environment.apiUrl}/mesas`;

  constructor(private http: HttpClient) {}

  obtenerTodas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(this.apiUrl);
  }

  crear(data: any): Observable<Mesa> {
    return this.http.post<Mesa>(this.apiUrl, data);
  }

  actualizar(id: number, data: any): Observable<Mesa> {
    return this.http.put<Mesa>(`${this.apiUrl}/${id}`, data);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

    cambiarActiva(id: number, activa: boolean) {
  return this.http.patch(
    `${this.apiUrl}/${id}/activa`,
    activa
  );
}
}