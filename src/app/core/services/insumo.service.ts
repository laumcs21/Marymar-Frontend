import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  InsumoCreateDTO,
  InsumoResponseDTO
} from '../models/insumo.model';

@Injectable({
  providedIn: 'root'
})
export class InsumoService {

  private apiUrl = `${environment.apiUrl}/insumos`;

  constructor(private http: HttpClient) {}

  // Obtener todos los insumos
  obtenerInsumos(): Observable<InsumoResponseDTO[]> {
    return this.http.get<InsumoResponseDTO[]>(this.apiUrl);
  }

  // Crear insumo
  crearInsumo(dto: InsumoCreateDTO): Observable<InsumoResponseDTO> {
    return this.http.post<InsumoResponseDTO>(this.apiUrl, dto);
  }

  eliminarInsumo(id:number){
  return this.http.delete(`${this.apiUrl}/${id}`);
}

actualizarInsumo(id:number, dto:InsumoCreateDTO){
  return this.http.put(`${this.apiUrl}/${id}`, dto);
}

}