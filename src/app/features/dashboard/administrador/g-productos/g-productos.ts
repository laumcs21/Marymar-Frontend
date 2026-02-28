import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';

import { ProductoService } from '../../../../core/services/producto.service';
import { CategoriaService } from '../../../../core/services/categoria.service';

import { Producto } from '../../../../core/models/producto.model';
import { Categoria } from '../../../../core/models/categoria.model';

@Component({
  selector: 'app-g-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './g-productos.html',
  styleUrls: ['./g-productos.css']
})
export class GProductosComponent implements OnInit {

  productos: Producto[] = [];
  categorias: Categoria[] = [];

  mostrarModal = false;
  modoEdicion = false;
  productoEditandoId: number | null = null;
  categoriaSeleccionada: number | null = null;

  imagenesSeleccionadas: File[]=[];
  previews: string []=[];

  terminoBusqueda: string = '';
  productosOriginales: Producto[] = [];

  form!: FormGroup;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private fb: FormBuilder
  ) {}

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoriaId: [null, Validators.required],
      precio: [null, [Validators.required, Validators.min(0.01)]],
    });

    this.cargarCategorias();
    this.cargarProductos();
  }

  // =========================
  // CARGAS
  // =========================
  cargarCategorias() {
    this.categoriaService.obtenerTodas().subscribe({
      next: (data) => this.categorias = data
    });
  }

  cargarProductos() {
    this.productoService.obtenerTodos().subscribe({
      next: (data) => {this.productos = data;
      this.productosOriginales = data;}
    });
  }

  // =========================
  // MODAL
  // =========================
  abrirModalCrear() {
    this.modoEdicion = false;
    this.productoEditandoId = null;
    this.form.reset();
    this.imagenesSeleccionadas = [];
    this.previews = [];
        this.mostrarModal = true;
  }

  editarProducto(prod: Producto) {
    this.modoEdicion = true;
    this.productoEditandoId = prod.id;
    this.mostrarModal = true;

    this.form.patchValue({
      nombre: prod.nombre,
      descripcion: prod.descripcion,
      precio: prod.precio,
      categoriaId: prod.categoriaId
    });

    this.previews = [];

    if (prod.imagenPrincipal) {
      this.previews.push(prod.imagenPrincipal);
    } 
   }

  cerrarModal() {
    this.mostrarModal = false;
    this.form.reset();
    this.modoEdicion = false;
    this.productoEditandoId = null;
    this.imagenesSeleccionadas = [];
    this.previews = [];
  }

  // =========================
  // GUARDAR (CREATE + UPDATE)
  // =========================
  guardar() {
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

    this.imagenesSeleccionadas.forEach(img => {
      formData.append('imagenes', img);
    });

    if (this.modoEdicion && this.productoEditandoId) {

      this.productoService.actualizar(this.productoEditandoId, formData).subscribe({
      next: () => {
        if (this.categoriaSeleccionada) {
          this.filtrarPorCategoria(this.categoriaSeleccionada);
        } else {
          this.cargarProductos();
        }
        this.cerrarModal();
      }
      });

    } else {

      this.productoService.crear(formData).subscribe({
        next: () => {
          this.cargarProductos();
          this.cerrarModal();
        }
      });

    }
  }

  // =========================
  // ELIMINAR
  // =========================
  eliminarDefinitivo(id: number) {
    if (!confirm('Eliminar permanentemente este producto?')) return;

    this.productoService.eliminar(id).subscribe({
    next: () => {
      if (this.categoriaSeleccionada) {
        this.filtrarPorCategoria(this.categoriaSeleccionada);
      } else {
        this.cargarProductos();
      }
      this.cerrarModal();
    }   
   });
  }

  // =========================
  // FILTRO
  // =========================
  filtrarPorCategoria(id: number | null) {

    this.categoriaSeleccionada = id;

    if (!id) {
      this.cargarProductos();
      return;
    }

    this.productoService.obtenerPorCategoria(id).subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error filtrando productos', err)
    });
  }

  // =========================
  // IMAGEN
  // =========================
onFileSelected(event: any) {

  const files: FileList = event.target.files;
  if (!files) return;

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

  // =========================
  // DISPONIBILIDAD
  // =========================
  toggleDisponibilidad(prod: Producto) {

    this.productoService.desactivar(prod.id).subscribe({
      next: () => this.cargarProductos()
    });
  }

  buscarProductos() {

  const termino = this.terminoBusqueda.toLowerCase().trim();

  if (!termino) {
    this.productos = this.productosOriginales;
    return;
  }

  this.productos = this.productosOriginales.filter(p =>
    p.nombre.toLowerCase().includes(termino)
  );
}
}