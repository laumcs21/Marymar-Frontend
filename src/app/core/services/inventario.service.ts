import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  InventarioBodegueroDTO,
  InventarioCreateDTO,
  InventarioResponseDTO,
  InventarioUpdateDTO,
  LoteDTO
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

ingresarStock(insumoId: number, cantidad: number, fecha: string) {
  return this.http.post(
    `${this.apiUrl}/${insumoId}/ingresar`,
    null,
    {
      params: {
        cantidad,
        fechaVencimiento: fecha
      }
    }
  );
}

surtirCocina(insumoId: number, cantidad: number) {
  return this.http.post(
    `${this.apiUrl}/${insumoId}/surtir`,
    null,
    {
      params: { cantidad }
    }
  );
}

obtenerVistaBodeguero(): Observable<InventarioBodegueroDTO[]> {
  return this.http.get<InventarioBodegueroDTO[]>(`${this.apiUrl}/bodeguero`);
}

obtenerLotes(insumoId: number): Observable<LoteDTO[]> {
  return this.http.get<LoteDTO[]>(`${this.apiUrl}/${insumoId}/lotes`);
}

obtenerNotificaciones() {
  return this.http.get<any[]>(`${environment.apiUrl}/notificaciones`);
}

}