import { Component, OnInit } from '@angular/core';
import { InventarioService } from '../../../../core/services/inventario.service';
import { InsumoService } from '../../../../core/services/insumo.service';
import {
  InventarioBodegueroDTO,
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

  // ================== LISTAS ==================
  inventario: any[] = [];
  insumos: InsumoResponseDTO[] = [];

  // ================== CREAR ==================
  nuevoInsumo: InsumoCreateDTO = {
    nombre: '',
    unidad: ''
  };

  nuevoInventario: InventarioCreateDTO = {
    insumoId: 0,
    stock: 0
  };

  // ================== SELECCION ==================
  inventarioSeleccionado!: any;
  stockEditando: number = 0;

  // ================== MODALES ==================
  modalInsumo = false;
  modalInventario = false;
  mostrarModalEliminar = false;
  modalEditarStock = false;

  mostrarIngreso = false;
  mostrarSurtir = false;
  mostrarModalLotes = false;

  // ================== ELIMINAR ==================
  inventarioAEliminar: InventarioResponseDTO | null = null;
  eliminando = false;

  mostrarModalEliminarInsumo = false;
  insumoAEliminar: InsumoResponseDTO | null = null;

  // ================== ERRORES ==================
  errorInsumo: string = '';
  errorInventario: string = '';

  // ================== FORMULARIO ==================
  insumoEditandoId: number | null = null;
  modoFormulario: 'crear' | 'editar' | null = null;

  // ================== BUSQUEDA ==================
  busquedaInventario: string = '';
  busquedaInsumo: string = '';

  // ================== LOTES ==================
  lotes: any[] = [];
  filtroUbicacion: string = '';
  filtroFecha: string = '';

  // ================== INGRESO / SURTIR ==================
  cantidad: number | null = null;
  fecha = '';
  fechaMin: string = '';
  mostrarLotes = false;
  mostrarIngresoGlobal = false;


  insumoSeleccionado: any;
  insumoIdSeleccionado: number | null = null;
  


  constructor(
    private inventarioService: InventarioService,
    private insumoService: InsumoService
  ) {}

  // ================== INIT ==================
  ngOnInit(): void {
    this.cargarInsumosYLuegoInventario();

    const hoy = new Date();
    this.fechaMin = hoy.toISOString().split('T')[0];
  }

  // ================== CARGA ==================
  cargarInventario() {
    this.inventarioService.obtenerVistaBodeguero().subscribe({
      next: data => this.inventario = this.unirInventarioConInsumos(data),
      error: err => console.error(err)
    });
  }

  cargarInsumos() {
    this.insumoService.obtenerInsumos().subscribe({
      next: data => this.insumos = data,
      error: err => console.error(err)
    });
  }

  // ================== INSUMOS ==================
  abrirModalInsumo() {
    this.modalInsumo = true;
    this.cancelarFormularioInsumo();
  }

  cerrarModalInsumo() {
    this.modalInsumo = false;
    this.cancelarFormularioInsumo();
  }

  abrirCrearInsumo() {
    this.modoFormulario = 'crear';
    this.nuevoInsumo = { nombre: '', unidad: '' };
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
          this.errorInsumo = err.error?.message || 'Error';
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
          this.errorInsumo = err.error?.message || 'Error';
        }
      });
    }
  }

  cancelarFormularioInsumo() {
    this.modoFormulario = null;
    this.insumoEditandoId = null;
    this.nuevoInsumo = { nombre: '', unidad: '' };
    this.errorInsumo = '';
  }

  // ================== INVENTARIO ==================
  abrirModalInventario() {
    this.modalInventario = true;
  }

  cerrarModal() {
    this.modalInventario = false;
    this.errorInventario = '';
  }

  crearInventario() {
    this.inventarioService.crearInventario(this.nuevoInventario).subscribe({
      next: () => {
        this.nuevoInventario = { insumoId: 0, stock: 0 };
        this.cargarInventario();
        this.cerrarModal();
      },
      error: err => {
        this.errorInventario = err.error?.message || 'Error';
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
    ).subscribe(() => {
      this.cargarInventario();
      this.modalEditarStock = false;
    });
  }

  cerrarModalEditarStock() {
    this.modalEditarStock = false;
  }

  // ================== ELIMINAR ==================
  abrirModalEliminar(item: InventarioResponseDTO) {
    this.inventarioAEliminar = item;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar() {
    this.mostrarModalEliminar = false;
    this.inventarioAEliminar = null;
  }

  eliminarInventario(id: number) {
    this.inventarioService.eliminarInventario(id).subscribe(() => {
      this.cargarInventario();
      this.cerrarModalEliminar();
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

    this.insumoService.eliminarInsumo(this.insumoAEliminar.id).subscribe(() => {
      this.cargarInsumos();
      this.cargarInventario();
      this.cerrarModalEliminarInsumo();
    });
  }

  cerrarModalLotes(){
    this.mostrarModalLotes = false;
    this.filtroUbicacion = '';
    this.filtroFecha = '';
  }

  // ================== FILTROS ==================
get inventarioFiltrado() {
  const t = this.busquedaInventario.toLowerCase().trim();

  if (!t) return this.inventario;

  return this.inventario.filter(i => {

    return (
      i.insumoNombre?.toLowerCase().includes(t) ||
      i.unidad?.toLowerCase().includes(t) ||

      i.insumoId?.toString().includes(t) ||
      i.stockTotal?.toString().includes(t) ||
      i.stockCocina?.toString().includes(t) ||
      i.stockBodega?.toString().includes(t)
    );

  });
}
  get insumosFiltrados(){
    const t = this.busquedaInsumo.toLowerCase().trim();
    if(!t) return this.insumos;

    return this.insumos.filter(i =>
      i.nombre.toLowerCase().includes(t)
    );
  }

  abrirIngreso(item: any){
  this.insumoSeleccionado = item;
  this.cantidad = null;
  this.fecha = '';
  this.mostrarIngreso = true;
}

ingresar(){

  if(this.cantidad === null || this.cantidad <= 0 || !this.fecha){
    return;
  }

  const fecha = new Date(this.fecha);
  fecha.setHours(23,59,0,0);

  const fechaFormateada = fecha.toISOString().slice(0,19);

  this.inventarioService
    .ingresarStock(
      this.insumoSeleccionado.insumoId,
      this.cantidad,
      fechaFormateada
    )
    .subscribe(() => {
      this.mostrarIngreso = false;
      this.cargarInventario();
    });
}

abrirSurtir(item:any){
  this.insumoSeleccionado = item;
  this.cantidad = null;
  this.mostrarSurtir = true;
}

surtir(){

  if(this.cantidad === null || this.cantidad <= 0){
    return;
  }

  this.inventarioService
    .surtirCocina(
      this.insumoSeleccionado.insumoId,
      this.cantidad
    )
    .subscribe(() => {
      this.mostrarSurtir = false;
      this.cargarInventario();
    });
}

verLotes(item:any){
  this.insumoSeleccionado = item;

  this.inventarioService.obtenerLotes(item.insumoId)
    .subscribe(data => {
      this.lotes = data;
      this.mostrarLotes = true;
    });
}

get lotesFiltrados() {
  return this.lotes.filter(l => {

    const cumpleUbicacion = this.filtroUbicacion
      ? l.ubicacion === this.filtroUbicacion
      : true;

    const cumpleFecha = this.filtroFecha
      ? l.fechaVencimiento.startsWith(this.filtroFecha)
      : true;

    return cumpleUbicacion && cumpleFecha;
  });
}

cerrarLotes() {
  this.mostrarLotes = false;
  this.filtroUbicacion = '';
  this.filtroFecha = '';
}

  abrirIngresoGlobal(){
    this.cantidad = null;
    this.fecha = '';
    this.insumoIdSeleccionado = null;
    this.mostrarIngresoGlobal = true;
  }


ingresarGlobal(){

  if(!this.insumoIdSeleccionado || this.cantidad === null || this.cantidad <= 0 || !this.fecha){
    return;
  }

  const fecha = new Date(this.fecha);
  fecha.setHours(23,59,0,0);

  const fechaFormateada = fecha.toISOString().slice(0,19);

  this.inventarioService
    .ingresarStock(
      this.insumoIdSeleccionado,
      this.cantidad,
      fechaFormateada
    )
    .subscribe(() => {
      this.mostrarIngresoGlobal = false;
      this.cargarInventario();
    });
}

bloquearNegativos(event: KeyboardEvent) {
  if (event.key === '-' || event.key === 'e') {
    event.preventDefault();
  }
}

private unirInventarioConInsumos(data: InventarioBodegueroDTO[]) {
  return data.map(item => {

    const insumo = this.insumos.find(i => i.id === item.insumoId);

    return {
      ...item,
      insumo: insumo 
    };

  });
}

cargarInsumosYLuegoInventario() {
  this.insumoService.obtenerInsumos().subscribe({
    next: insumos => {
      this.insumos = insumos;

      this.inventarioService.obtenerVistaBodeguero().subscribe({
        next: data => {
          this.inventario = this.unirInventarioConInsumos(data);
        },
        error: err => console.error(err)
      });

    },
    error: err => console.error(err)
  });
}

}