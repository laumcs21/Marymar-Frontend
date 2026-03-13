import { Component, OnInit } from '@angular/core';
import { InventarioService } from '../../../../core/services/inventario.service';
import { InsumoService } from '../../../../core/services/insumo.service';
import {
  InventarioCreateDTO,
  InventarioResponseDTO,
  InventarioUpdateDTO
} from '../../../../core/models/inventario.model';
import {
  InsumoCreateDTO,
  InsumoResponseDTO
} from '../../../../core/models/insumo.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-g-inventario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './g-inventario.html',
  styleUrls: ['./g-inventario.css']
})
export class GInventarioComponent implements OnInit {

  inventario: InventarioResponseDTO[] = [];
  insumos: InsumoResponseDTO[] = [];

  nuevoInsumo: InsumoCreateDTO = {
    nombre: '',
    unidad: ''
  };

  nuevoInventario: InventarioCreateDTO = {
    insumoId: 0,
    stock: 0
  };

  inventarioSeleccionado!: InventarioResponseDTO;
  stockEditando: number = 0;

  modalInsumo = false;
  modalInventario = false;
  mostrarModalEliminar = false;
  modalEditarStock = false;

  inventarioAEliminar: InventarioResponseDTO | null = null;
  eliminando = false;

  mostrarModalEliminarInsumo = false;
  insumoAEliminar: InsumoResponseDTO | null = null;

  errorInsumo: string = '';
  errorInventario: string = '';

  insumoEditandoId: number | null = null;

  modoFormulario: 'crear' | 'editar' | null = null;

  constructor(
    private inventarioService: InventarioService,
    private insumoService: InsumoService
  ) {}

  ngOnInit(): void {
    this.cargarInventario();
    this.cargarInsumos();
  }

  cargarInventario() {
    this.inventarioService.obtenerInventario().subscribe({
      next: data => this.inventario = data,
      error: err => console.error(err)
    });
  }

  cargarInsumos() {
    this.insumoService.obtenerInsumos().subscribe({
      next: data => this.insumos = data,
      error: err => console.error(err)
    });
  }

  abrirModalInsumo() {
    this.modalInsumo = true;
    this.cancelarFormularioInsumo();
  }

  abrirModalInventario() {
    this.modalInventario = true;
  }

  cerrarModal() {
    this.modalInsumo = false;
    this.modalInventario = false;
    this.cancelarFormularioInsumo();
    this.errorInventario = '';
  }

  abrirCrearInsumo() {
    this.modoFormulario = 'crear';

    this.nuevoInsumo = {
      nombre: '',
      unidad: ''
    };

    this.errorInsumo = '';
  }

  editarInsumo(insumo: InsumoResponseDTO) {

    this.modoFormulario = 'editar';

    this.insumoEditandoId = insumo.id;

    this.nuevoInsumo = {
      nombre: insumo.nombre,
      unidad: insumo.unidad
    };

  }

  guardarInsumo() {

    if (this.modoFormulario === 'crear') {

      this.insumoService.crearInsumo(this.nuevoInsumo).subscribe({
        next: () => {
          this.cargarInsumos();
          this.cancelarFormularioInsumo();
        },
        error: err => {
          this.errorInsumo =
            err.error?.message || 'No se pudo crear el insumo';
        }
      });

    }

    if (this.modoFormulario === 'editar' && this.insumoEditandoId !== null) {

      this.insumoService.actualizarInsumo(
        this.insumoEditandoId,
        this.nuevoInsumo
      ).subscribe({
        next: () => {
          this.cargarInsumos();
          this.cancelarFormularioInsumo();
        },
        error: err => {
          this.errorInsumo =
            err.error?.message || 'No se pudo actualizar el insumo';
        }
      });

    }

  }

  cancelarFormularioInsumo() {

    this.modoFormulario = null;

    this.insumoEditandoId = null;

    this.nuevoInsumo = {
      nombre: '',
      unidad: ''
    };

    this.errorInsumo = '';

  }

  crearInventario() {
    this.errorInventario = '';

    this.inventarioService.crearInventario(this.nuevoInventario).subscribe({
      next: () => {
        this.nuevoInventario = { insumoId: 0, stock: 0 };
        this.cargarInventario();
        this.cerrarModal();
      },
      error: err => {
        this.errorInventario =
          err.error?.message || 'No se pudo registrar el inventario';
      }
    });
  }

  abrirEditarStock(item: InventarioResponseDTO) {
    this.inventarioSeleccionado = item;
    this.stockEditando = item.stock;
    this.modalEditarStock = true;
  }

  guardarStock() {
    const dto: InventarioUpdateDTO = {
      stock: this.stockEditando
    };

    this.inventarioService.actualizarStock(
      this.inventarioSeleccionado.id,
      dto
    ).subscribe({
      next: () => {
        this.cargarInventario();
        this.modalEditarStock = false;
      },
      error: err => console.error(err)
    });
  }

  cerrarModalEditarStock() {
    this.modalEditarStock = false;
  }

  abrirModalEliminar(item: InventarioResponseDTO) {
    this.inventarioAEliminar = item;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar() {
    if (this.eliminando) return;
    this.mostrarModalEliminar = false;
    this.inventarioAEliminar = null;
  }

  eliminarInventario(id: number) {
    this.inventarioService.eliminarInventario(id).subscribe({
      next: () => {
        this.cargarInventario();
        this.cerrarModalEliminar();
      },
      error: err => console.error(err)
    });
  }

  abrirModalEliminarInsumo(insumo: InsumoResponseDTO) {
    this.insumoAEliminar = insumo;
    this.mostrarModalEliminarInsumo = true;
  }

  cerrarModalEliminarInsumo() {
    this.mostrarModalEliminarInsumo = false;
    this.insumoAEliminar = null;
  }

  eliminarInsumo() {
    if (!this.insumoAEliminar) return;

    this.insumoService.eliminarInsumo(this.insumoAEliminar.id).subscribe({
      next: () => {
        this.cargarInsumos();
        this.cargarInventario();
        this.cerrarModalEliminarInsumo();
      },
      error: err => console.error(err)
    });
  }

  cerrarModalInsumo() {
  this.modalInsumo = false;
  this.cancelarFormularioInsumo();
}

}