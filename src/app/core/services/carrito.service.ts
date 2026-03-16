import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ItemCarrito {
  productoId: number;
  nombre: string;
  precio: number;
  imagen?: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carrito: ItemCarrito[] = [];

  private cantidadSubject = new BehaviorSubject<number>(0);
  cantidad$ = this.cantidadSubject.asObservable();

  constructor() {
    const data = localStorage.getItem('carrito');

    if (data) {
      this.carrito = JSON.parse(data);
    }

    this.actualizarCantidad();
  }

  obtenerCarrito(): ItemCarrito[] {
    return this.carrito;
  }

  agregarProducto(producto: any): void {
    const existente = this.carrito.find(
      p => p.productoId === producto.id
    );

    if (existente) {
      existente.cantidad++;
    } else {
      this.carrito.push({
        productoId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagenPrincipal,
        cantidad: 1
      });
    }

    this.guardar();
    this.actualizarCantidad();
  }

  eliminarProducto(id: number): void {
    this.carrito = this.carrito.filter(
      p => p.productoId !== id
    );

    this.guardar();
    this.actualizarCantidad();
  }

  aumentarCantidad(id: number): void {
    const item = this.carrito.find(
      p => p.productoId === id
    );

    if (item) {
      item.cantidad++;
      this.guardar();
      this.actualizarCantidad();
    }
  }

  disminuirCantidad(id: number): void {
    const item = this.carrito.find(
      p => p.productoId === id
    );

    if (!item) return;

    if (item.cantidad > 1) {
      item.cantidad--;
      this.guardar();
      this.actualizarCantidad();
    } else {
      this.eliminarProducto(id);
    }
  }

  vaciarCarrito(): void {
    this.carrito = [];
    this.guardar();
    this.actualizarCantidad();
  }

  obtenerTotal(): number {
    return this.carrito.reduce(
      (total, item) => total + (item.precio * item.cantidad),
      0
    );
  }

  obtenerCantidadTotal(): number {
    return this.carrito.reduce(
      (total, item) => total + item.cantidad,
      0
    );
  }

  private guardar(): void {
    localStorage.setItem(
      'carrito',
      JSON.stringify(this.carrito)
    );
  }

  private actualizarCantidad(): void {
    this.cantidadSubject.next(this.obtenerCantidadTotal());
  }
}