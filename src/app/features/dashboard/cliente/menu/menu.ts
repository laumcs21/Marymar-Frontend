import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductoService } from '../../../../core/services/producto.service';
import { CategoriaService } from '../../../../core/services/categoria.service';

import { Producto } from '../../../../core/models/producto.model';
import { Categoria } from '../../../../core/models/categoria.model';
import { CarritoService } from '../../../../core/services/carrito.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent implements OnInit {

  productos: Producto[] = []
  productosOriginales: Producto[] = []

  categorias: Categoria[] = []

  terminoBusqueda = ''

  categoriaSeleccionada:number | null = null

  productoVista:Producto | null = null
  mostrarModalVista = false

  constructor(
    private productoService:ProductoService,
    private categoriaService:CategoriaService,
    private carritoService: CarritoService
  ){}

  ngOnInit(): void {

    this.cargarCategorias()
    this.cargarProductos()

  }

  /* ==========================
  CARGAR DATOS
  ========================== */

  cargarCategorias(){

    this.categoriaService.obtenerTodas()
    .subscribe({
      next:(data)=>{
        this.categorias = data
      }
    })

  }

  cargarProductos(){

    this.productoService.obtenerTodos()
    .subscribe({

      next:(data)=>{

        /* SOLO ACTIVOS */
        this.productosOriginales = data.filter(p => p.activo)

        this.aplicarFiltros()

      }

    })

  }

  /* ==========================
  FILTROS
  ========================== */

  aplicarFiltros(){

    let lista = [...this.productosOriginales]

    if(this.categoriaSeleccionada){

      lista = lista.filter(
        p => p.categoriaId === this.categoriaSeleccionada
      )

    }

    const termino = this.terminoBusqueda.toLowerCase().trim()

    if(termino){

      lista = lista.filter(p =>
        p.nombre.toLowerCase().includes(termino)
      )

    }

    this.productos = lista

  }

  filtrarPorCategoria(id:number | null){

    this.categoriaSeleccionada = id
    this.aplicarFiltros()

  }

  buscar(){

    this.aplicarFiltros()

  }

  /* ==========================
  MODAL PRODUCTO
  ========================== */

  verProducto(prod:Producto){

    this.productoVista = prod
    this.mostrarModalVista = true

  }

  cerrarModalVista(){

    this.productoVista = null
    this.mostrarModalVista = false

  }

  agregarAlCarrito(producto:any){
    this.carritoService.agregarProducto(producto)
  }
  

}