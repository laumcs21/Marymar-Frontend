import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule
} from '@angular/forms';

import { ProductoService } from '../../../../core/services/producto.service';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { ProductoInsumo } from '../../../../core/models/productoInsumo.model';
import { Producto } from '../../../../core/models/producto.model';
import { Categoria } from '../../../../core/models/categoria.model';
import { ProductoInsumoService } from '../../../../core/services/productoInsumo.service';
import { InsumoService } from '../../../../core/services/insumo.service';
@Component({
  selector: 'app-g-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './g-productos.html',
  styleUrls: ['./g-productos.css']
})
export class GProductosComponent implements OnInit {

  productos: Producto[] = [];
  productosOriginales: Producto[] = [];
  categorias: Categoria[] = [];

  mostrarModal = false;
  modoEdicion = false;
  productoEditandoId: number | null = null;
  categoriaSeleccionada: number | null = null;

  imagenesSeleccionadas: File[] = [];
  previews: string[] = [];

  terminoBusqueda = '';

  productoAEliminar: Producto | null = null;
  mostrarModalEliminar = false;
  eliminando = false;

  form!: FormGroup;
  productoVista: Producto | null = null;
  mostrarModalVista = false;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private fb: FormBuilder,
    private productoInsumoService: ProductoInsumoService,
    private insumoService: InsumoService

  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoriaId: [null, Validators.required],
      precio: [null, [Validators.required, Validators.min(0.01)]],
      cantidad : [1, [Validators.required]]
    });

    this.cargarCategorias();
    this.cargarProductos();
  }

  trackById(index: number, item: Producto): number {
    return item.id;
  }

  verProducto(prod: Producto): void {
    this.productoVista = prod;
    this.mostrarModalVista = true;
  }

  cerrarModalVista(): void {
    this.mostrarModalVista = false;
    this.productoVista = null;
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerTodas().subscribe({
      next: (data) => this.categorias = data
    });
  }

  cargarProductos(): void {
    this.productoService.obtenerTodos().subscribe({
      next: (data) => {
        this.productosOriginales = data;
        this.aplicarFiltros();
      }
    });
  }

  aplicarFiltros(): void {
    let lista = [...this.productosOriginales];

    if (this.categoriaSeleccionada) {
      lista = lista.filter(p => p.categoriaId === this.categoriaSeleccionada);
    }

    const termino = this.terminoBusqueda.toLowerCase().trim();
    if (termino) {
      lista = lista.filter(p =>
        p.nombre.toLowerCase().includes(termino)
      );
    }

    this.productos = lista;
  }

  filtrarPorCategoria(id: number | null): void {
    this.categoriaSeleccionada = id;
    this.aplicarFiltros();
  }

  buscarProductos(): void {
    this.aplicarFiltros();
  }

  abrirModalCrear(): void {
    this.modoEdicion = false;
    this.productoEditandoId = null;
    this.form.reset();
    this.imagenesSeleccionadas = [];
    this.previews = [];
    this.mostrarModal = true;
  }

  editarProducto(prod: Producto): void {
    this.modoEdicion = true;
    this.productoEditandoId = prod.id;
    this.mostrarModal = true;

    this.form.patchValue({
      nombre: prod.nombre,
      descripcion: prod.descripcion,
      precio: prod.precio,
      categoriaId: prod.categoriaId
    });

    this.imagenesSeleccionadas = [];
    this.previews = [];

    if (prod.imagenPrincipal) {
      this.previews.push(prod.imagenPrincipal);
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.form.reset();
    this.modoEdicion = false;
    this.productoEditandoId = null;
    this.imagenesSeleccionadas = [];
    this.previews = [];
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      nombre: this.form.value.nombre,
      descripcion: this.form.value.descripcion,
      precio: this.form.value.precio,
      categoriaId: this.form.value.categoriaId
    };

    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(payload)], { type: 'application/json' })
    );

    if (this.imagenesSeleccionadas.length > 0) {
      this.imagenesSeleccionadas.forEach(img => {
        formData.append('imagenes', img);
      });
    }

    if (this.modoEdicion && this.productoEditandoId) {
      this.productoService.actualizar(this.productoEditandoId, formData).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarProductos();
        }
      });
    } else {
      this.productoService.crear(formData).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarProductos();
        }
      });
    }
  }

abrirModalEliminar(prod: Producto): void {
  this.productoAEliminar = prod;
  this.mostrarModalEliminar = true;
}

cerrarModalEliminar(): void {
  if (this.eliminando) return;
  this.mostrarModalEliminar = false;
  this.productoAEliminar = null;
}

confirmarEliminarProducto(): void {
  if (!this.productoAEliminar) return;

  this.eliminando = true;

  this.productoService.eliminar(this.productoAEliminar.id).subscribe({
    next: () => {
      this.eliminando = false;
      this.cerrarModalEliminar();
      this.cargarProductos();
    },
    error: () => {
      this.eliminando = false;
    }
  });
}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files) return;

    this.imagenesSeleccionadas = [];
    this.previews = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.imagenesSeleccionadas.push(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.previews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  eliminarImagen(index: number): void {
    this.previews.splice(index, 1);

    if (index < this.imagenesSeleccionadas.length) {
      this.imagenesSeleccionadas.splice(index, 1);
    }
  }

  toggleDisponibilidad(prod: Producto): void {
    this.productoService.desactivar(prod.id).subscribe({
      next: () => this.cargarProductos()
    });
  }

 /* ===========================
   SECCION RECETA
=========================== */

receta: ProductoInsumo[] = []
insumos:any[] = []

mensajeErrorReceta:string = ''
mensajeErrorActualizarReceta:string = ''

nuevoInsumoReceta = {
  insumoId:0,
  cantidad:1
}

mostrarModalReceta = false

productoReceta:any = null

productoSeleccionadoId:number = 0

/* ABRIR MODAL */

abrirModalReceta(prod:any){

  this.productoReceta = prod
  this.productoSeleccionadoId = prod.id
  this.mostrarModalReceta = true

  this.nuevoInsumoReceta = {
    insumoId:0,
    cantidad:1
  }

  this.cargarReceta()
  this.cargarInsumos()

}

/* CERRAR MODAL */

cerrarModalReceta(){

  this.mostrarModalReceta = false
  this.productoReceta = null

  this.receta = []
  this.mensajeErrorReceta = '';
  

  this.nuevoInsumoReceta = {
    insumoId:0,
    cantidad:1
  }

}

/* LISTAR RECETA */

cargarReceta(){

  this.productoInsumoService
  .listar(this.productoSeleccionadoId)
  .subscribe({

    next:(res)=>{

      this.receta = res

    },

    error:()=>{

      this.receta = []

    }

  })

}

/* LISTAR INSUMOS */

cargarInsumos(){

  this.insumoService.obtenerInsumos()
  .subscribe({

    next:(data)=>{
      this.insumos = data
    }

  })

}

/* AGREGAR INSUMO */
agregarInsumo(){

  this.mensajeErrorReceta = '';

  if(this.nuevoInsumoReceta.insumoId === 0){
    this.mensajeErrorReceta = "Selecciona un insumo";
    return;
  }

  const dto = {
    productoId: this.productoSeleccionadoId,
    insumoId: this.nuevoInsumoReceta.insumoId,
    cantidad: this.nuevoInsumoReceta.cantidad
  };

this.productoInsumoService.crear(dto).subscribe({
  next: () => {
    this.cargarReceta();
    this.nuevoInsumoReceta = { insumoId:0, cantidad:1 };
  },
  error: (err) => {

    if(err?.error?.message){
      this.mensajeErrorReceta = err.error.message;
    }else{
      this.mensajeErrorReceta = "Ocurrió un error al agregar el insumo";
    }

  }
});
}

/* ELIMINAR */

eliminarInsumoReceta(item:ProductoInsumo){

  if(!confirm("Eliminar insumo de la receta?")) return

  this.productoInsumoService
  .eliminar(item.id)
  .subscribe({

    next:()=>{

      this.cargarReceta()

    }

  })

}

mostrarModalEditarCantidad = false
insumoEditando: any = null
nuevaCantidad = 1

abrirEditarCantidad(item:any){
  this.mensajeErrorActualizarReceta= "";
  this.insumoEditando = item
  this.nuevaCantidad = item.cantidad
  this.mostrarModalEditarCantidad = true
}

cerrarEditarCantidad(){
  this.mostrarModalEditarCantidad = false
}

guardarNuevaCantidad(){

  this.mensajeErrorActualizarReceta= "";


  this.productoInsumoService
  .actualizarCantidad(this.insumoEditando.id, this.nuevaCantidad)
  .subscribe({

    next: () => {
      this.cargarReceta()
      this.cerrarEditarCantidad()
    },

    error: (err) => {

      if(err?.error?.message){
        this.mensajeErrorActualizarReceta = err.error.message
      }else{
        this.mensajeErrorActualizarReceta = "Ocurrió un error al actualizar el insumo"
      }

    }

  })

}
mostrarModalEliminarInsumo = false
insumoEliminar:any = null

abrirEliminarInsumo(item:any){
  this.insumoEliminar = item
  this.mostrarModalEliminarInsumo = true
}

cerrarEliminarInsumo(){
  this.mostrarModalEliminarInsumo = false
}

confirmarEliminarInsumo(){

  this.productoInsumoService
  .eliminar(this.insumoEliminar.id)
  .subscribe({
    next:()=>{
      this.cerrarEliminarInsumo()
      this.cargarReceta()
    }
  })

}

limpiarCantidad(){
  if(this.nuevoInsumoReceta.cantidad === 1){
    this.nuevoInsumoReceta.cantidad = null as any
  }
}
}