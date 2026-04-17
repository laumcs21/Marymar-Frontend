import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private apiUrl = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  obtenerPorMesa(mesaId: number) {
    return this.http.get<any>(`${this.apiUrl}/mesa/${mesaId}`);
  }

    obtenerTodos() {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  agregarProducto(pedidoId: number, productoId: number) {
  return this.http.post(
    `${this.apiUrl}/${pedidoId}/agregar-producto?productoId=${productoId}&cantidad=1`,
    {}
  );
}

disminuirProducto(pedidoId: number, productoId: number) {
  return this.http.put(
    `${this.apiUrl}/${pedidoId}/disminuir-producto?productoId=${productoId}`,
    {}
  );
}

eliminarDetalle(pedidoId: number, detalleId: number) {
  return this.http.delete(
    `${this.apiUrl}/${pedidoId}/detalle/${detalleId}`
  );
}

abrirPedido(mesaId: number, meseroId: number) {
  return this.http.post<any>(
    `${this.apiUrl}/mesa/${mesaId}/abrir?meseroId=${meseroId}`,
    {}
  );
}

descargarFactura(id: number) {
  this.http.get(`${this.apiUrl}/${id}/factura`, {
    responseType: 'blob'
  }).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  });
}

descargarComanda(id: number) {
  this.http.get(`${this.apiUrl}/${id}/comanda`, {
    responseType: 'blob'
  }).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  });
}

filtrar(filtros: any) {
  let params: any = {};

  if (filtros.fechaInicio) {
    params.fechaInicio = filtros.fechaInicio + 'T00:00:00';
  }

  if (filtros.fechaFin) {
    params.fechaFin = filtros.fechaFin + 'T23:59:59';
  }

  if (filtros.estado) {
    params.estado = filtros.estado;
  }

  return this.http.get<any>(`${this.apiUrl}/filtrar`, { params });
}

obtenerCola(estado: string) {
  return this.http.get<any>(`${this.apiUrl}/cola/${estado}`);
}

cambiarEstado(id: number, estado: string) {
  return this.http.put<any>(`${this.apiUrl}/${id}/estado?estado=${estado}`, {});
}

}