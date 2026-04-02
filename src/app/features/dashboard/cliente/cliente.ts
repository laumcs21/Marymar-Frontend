import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../core/services/producto.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './cliente.html',
  styleUrls: ['./cliente.css'],
})
export class ClienteComponent implements OnInit {

  rol!: string | null;
  productos: any[] = [];
  productosRandom: any[] = [];
  productoVista: any;
  mostrarModalVista = false;
  cantidadCarrito = 0;

  constructor(private router: Router, private productoService: ProductoService, private carritoService: CarritoService, private authService: AuthService
  ) {}

  ngOnInit() {
    this.rol = localStorage.getItem('rol');
    this.cargarProductos();
    this.actualizarCantidad();
    this.carritoService.cantidad$.subscribe(cantidad =>{this.cantidadCarrito=cantidad})

  }

logout() {
  this.authService.logout();
  this.router.navigate(['/login']);
}

cargarProductos() {

  this.productoService.obtenerTodos().subscribe(res => {

    this.productos = res;

    const disponibles = this.productos.filter(p => p.activo === true);

    const random = [...disponibles]
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);

    this.productosRandom = random;

    console.log("Productos activos:", this.productosRandom);

  });

}

  verProducto(prod:any){

    this.productoVista = prod;
    this.mostrarModalVista = true;

}

  cerrarModalVista(){
    this.mostrarModalVista = false;
}

  agregarAlCarrito(prod:any){

    console.log("Producto agregado al carrito", prod);
}

irInicio(){
  this.router.navigate(['/dashboard/cliente']);
}

irMenu(){
  this.router.navigate(['/dashboard/cliente/menu']);
}

irCarrito() {
  this.router.navigate(['/dashboard/cliente/carrito']);
}
actualizarCantidad(){
  this.cantidadCarrito = this.carritoService.obtenerCantidadTotal();
}
}