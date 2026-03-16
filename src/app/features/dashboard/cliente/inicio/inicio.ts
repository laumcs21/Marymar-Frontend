import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../../core/services/producto.service';
import { Producto } from '../../../../core/models/producto.model';
import { Router, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-inicio-cliente',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class InicioComponent implements OnInit {

  productosRandom: Producto[] = []

  constructor(
    private productoService: ProductoService, private router: Router
  ){}

  ngOnInit(): void {
    this.cargarProductos()
  }

  cargarProductos(){

    this.productoService.obtenerTodos()
    .subscribe({

      next:(data)=>{

        const activos = data.filter(p => p.activo)

        this.productosRandom = activos
        .sort(() => 0.5 - Math.random())
        .slice(0,6)

      }

    })

  }

  verProducto(prod:Producto){

    console.log("Ver producto", prod)

  }

  agregarAlCarrito(prod:Producto){

    console.log("Agregar al carrito", prod)

  }

  irMenu(){
  this.router.navigate(['/dashboard/cliente/menu']);
}
}