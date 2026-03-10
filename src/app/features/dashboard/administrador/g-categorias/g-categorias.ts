import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { Categoria } from '../../../../core/models/categoria.model';

@Component({
  selector: 'app-g-categorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './g-categorias.html',
  styleUrls: ['./g-categorias.css']
})
export class GCategoriasComponent implements OnInit {

  categorias: Categoria[] = [];
  form!: FormGroup;
  mostrarModal = false;
  modoEdicion = false;
  categoriaEditandoId: number | null = null;
  terminoBusqueda: string = '';
  categoriasFiltradas: Categoria []=[];
  categoriaAEliminar: Categoria | null = null;
  mostrarModalEliminar = false;
  eliminando = false;

  constructor(
    private categoriaService: CategoriaService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
    });

    this.cargarCategorias();
  }

cargarCategorias() {
  this.categoriaService.obtenerTodas().subscribe(data => {
    this.categorias = data;
    this.categoriasFiltradas = data; 
  });
}

  abrirModal() {
    this.modoEdicion = false;
    this.form.reset();
    this.mostrarModal = true;
  }

  editarCategoria(cat: Categoria) {
    this.modoEdicion = true;
    this.categoriaEditandoId = cat.id;
    this.form.patchValue(cat);
    this.mostrarModal = true;
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.modoEdicion && this.categoriaEditandoId) {
      this.categoriaService.actualizar(this.categoriaEditandoId, this.form.value)
        .subscribe(() => {
          this.cargarCategorias();
          this.cerrarModal();
        });
    } else {
      this.categoriaService.crear(this.form.value)
        .subscribe(() => {
          this.cargarCategorias();
          this.cerrarModal();
        });
    }
  }

abrirModalEliminar(cat: Categoria) {
  this.categoriaAEliminar = cat;
  this.mostrarModalEliminar = true;
}

cerrarModalEliminar() {
  if (this.eliminando) return;
  this.mostrarModalEliminar = false;
  this.categoriaAEliminar = null;
}

confirmarEliminarCategoria() {

  if (!this.categoriaAEliminar) return;

  this.eliminando = true;

  this.categoriaService.eliminar(this.categoriaAEliminar.id)
    .subscribe({
      next: () => {
        this.eliminando = false;
        this.cerrarModalEliminar();
        this.cargarCategorias();
      },
      error: () => {
        this.eliminando = false;
      }
    });
}

  cerrarModal() {
    this.mostrarModal = false;
    this.form.reset();
  }

  filtrarCategorias() {
  const termino = this.terminoBusqueda.toLowerCase().trim();

  if (!termino) {
    this.categoriasFiltradas = this.categorias;
    return;
  }

  this.categoriasFiltradas = this.categorias.filter(cat =>
    cat.nombre.toLowerCase().includes(termino)
  );
}
}