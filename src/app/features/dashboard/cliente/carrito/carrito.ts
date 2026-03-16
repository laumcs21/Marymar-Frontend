import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService, ItemCarrito } from '../../../../core/services/carrito.service';
import { Router, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-carrito',
  standalone:true,
  imports:[CommonModule],
  templateUrl:'./carrito.html'
})
export class CarritoComponent implements OnInit{

  items:ItemCarrito[] = []
  total = 0

  constructor(
    private carritoService:CarritoService,
    private router:Router
  ){}

  ngOnInit(){

    this.cargar()

  }

  cargar(){

    this.items = this.carritoService.obtenerCarrito()

    this.total = this.carritoService.obtenerTotal()

  }

  aumentar(id:number){

    this.carritoService.aumentarCantidad(id)

    this.cargar()

  }

  disminuir(id:number){

    this.carritoService.disminuirCantidad(id)

    this.cargar()

  }

  eliminar(id:number){

    this.carritoService.eliminarProducto(id)

    this.cargar()

  }

  irMenu(){
  this.router.navigate(['/dashboard/cliente/menu']);
}


}