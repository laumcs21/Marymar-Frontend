import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  InventarioCreateDTO,
  InventarioResponseDTO,
  InventarioUpdateDTO
} from '../models/inventario.model';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private apiUrl = `${environment.apiUrl}/inventario`;

  constructor(private http: HttpClient) {}

  // Obtener inventario completo
  obtenerInventario(): Observable<InventarioResponseDTO[]> {
    return this.http.get<InventarioResponseDTO[]>(this.apiUrl);
  }

  // Crear registro inventario
  crearInventario(dto: InventarioCreateDTO): Observable<InventarioResponseDTO> {
    return this.http.post<InventarioResponseDTO>(this.apiUrl, dto);
  }

  // Actualizar stock
  actualizarStock(
    id: number,
    dto: InventarioUpdateDTO
  ): Observable<InventarioResponseDTO> {
    return this.http.put<InventarioResponseDTO>(`${this.apiUrl}/${id}`, dto);
  }

  eliminarInventario(id:number){
  return this.http.delete(`${this.apiUrl}/${id}`);
}

}