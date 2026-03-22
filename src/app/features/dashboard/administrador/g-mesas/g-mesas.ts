import { Component, OnInit } from '@angular/core';
import { MesaService } from '../../../../core/services/mesa.service';
import { Mesa } from '../../../../core/models/mesa.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-g-mesas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './g-mesas.html'
})
export class GMesasComponent implements OnInit {

  mesas: Mesa[] = [];
  mesasFiltradas: Mesa[] = [];

  form!: FormGroup;

  mostrarModal = false;
  modoEdicion = false;
  mesaEditandoId: number | null = null;
  totalMesas = 0;
  mesasDisponibles = 0;
  mesasOcupadas = 0;
  mesaAEliminar: Mesa | null = null;
  mostrarModalEliminar = false;
  eliminando = false;
  errorMsg = '';
  errorForm = '';

  terminoBusqueda = '';

  constructor(
    private mesaService: MesaService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
this.form = this.fb.group({
  numero: [
    '',
    [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
      Validators.min(1)
    ]
  ]
});

    this.cargarMesas();
  }

  cargarMesas() {
  this.mesaService.obtenerTodas().subscribe(data => {
    this.mesas = data;
    this.mesasFiltradas = data;

    this.totalMesas = data.length;
    this.mesasDisponibles = data.filter(m => m.estado === 'DISPONIBLE').length;
    this.mesasOcupadas = data.filter(m => m.estado === 'OCUPADA').length;
  });
}

abrirModal() {
  this.modoEdicion = false;
  this.mesaEditandoId = null;
  this.form.reset();
  this.errorForm = '';
  this.mostrarModal = true;
}

editarMesa(mesa: Mesa) {
  this.modoEdicion = true;
  this.mesaEditandoId = mesa.id;
  this.errorForm = '';
  this.form.patchValue(mesa);
  this.mostrarModal = true;
}

guardar() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.errorForm = '';

  const request = this.modoEdicion && this.mesaEditandoId
    ? this.mesaService.actualizar(this.mesaEditandoId, this.form.value)
    : this.mesaService.crear(this.form.value);

  request.subscribe({
    next: () => {
      this.cargarMesas();
      this.cerrarModal();
    },
    error: (err) => {
      this.errorForm = err?.error?.message || 'Error al guardar la mesa';
    }
  });
}

  eliminarMesa(id: number) {
    this.mesaService.eliminar(id).subscribe(() => {
      this.cargarMesas();
    });
  }

cerrarModal() {
  this.mostrarModal = false;
  this.form.reset();
  this.errorForm = '';
  this.modoEdicion = false;
  this.mesaEditandoId = null;
}

  filtrar() {
    const t = this.terminoBusqueda.toLowerCase();

    this.mesasFiltradas = this.mesas.filter(m =>
      m.numero.toString().includes(t)
    );
  }

toggleActiva(mesa: Mesa) {

  const nuevoEstado = !mesa.activa;

  if (mesa.estado === 'OCUPADA' && nuevoEstado === false) {
    alert("No puedes desactivar una mesa ocupada");
    return;
  }

  this.mesaService.cambiarActiva(mesa.id, nuevoEstado)
    .subscribe(() => {
      mesa.activa = nuevoEstado;
    });
}

abrirModalEliminar(mesa: Mesa) {
  this.mesaAEliminar = mesa;
  this.mostrarModalEliminar = true;
  this.errorMsg = '';
}

cerrarModalEliminar() {
  if (this.eliminando) return;
  this.mostrarModalEliminar = false;
  this.mesaAEliminar = null;
}

confirmarEliminarMesa() {
  if (!this.mesaAEliminar) return;

  this.eliminando = true;
  this.errorMsg = '';

  this.mesaService.eliminar(this.mesaAEliminar.id)
    .subscribe({
      next: () => {
        this.eliminando = false;
        this.cerrarModalEliminar();
        this.cargarMesas();
      },
      error: (err) => {
        this.eliminando = false;

        this.errorMsg = err?.error?.message || 'Error al eliminar la mesa';
      }
    });
}

}