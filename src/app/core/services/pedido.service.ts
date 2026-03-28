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

}