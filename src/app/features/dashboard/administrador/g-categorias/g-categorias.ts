import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { Categoria } from '../../../../core/models/categoria.model';

@Component({
  selector: 'app-g-categorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './g-categorias.html',
  styleUrls: ['./g-categorias.css']
})
export class GCategoriasComponent implements OnInit {

  categorias: Categoria[] = [];
  form!: FormGroup;
  mostrarModal = false;
  modoEdicion = false;
  categoriaEditandoId: number | null = null;

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

  eliminar(id: number) {
    if (!confirm('¿Eliminar categoría?')) return;

    this.categoriaService.eliminar(id)
      .subscribe(() => this.cargarCategorias());
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.form.reset();
  }
}