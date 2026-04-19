import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../../../core/services/inventario.service';
import { Router } from '@angular/router';
import { InventarioBodegueroDTO, LoteDTO } from '../../../../core/models/inventario.model';
import { InsumoService } from '../../../../core/services/insumo.service';
import { InsumoResponseDTO } from '../../../../core/models/insumo.model';

@Component({
  selector: 'app-inventario-bodeguero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.html',
  styleUrls: ['./inventario.css']
})
export class InventarioBodegueroComponent implements OnInit {

  inventario: InventarioBodegueroDTO[] = [];
  lotes: LoteDTO[] = [];

  insumoSeleccionado: any;

  mostrarIngreso = false;
  mostrarSurtir = false;
  mostrarLotes = false;

  cantidad: number | null = null;
  fecha = '';

  mostrarIngresoGlobal = false;
  insumoIdSeleccionado: number | null = null;

  insumos: InsumoResponseDTO[] = [];
  fechaMin: string = '';

  filtroUbicacion: string = '';
filtroFecha: string = '';

busquedaInventario: string = '';

  constructor(
    private inventarioService: InventarioService,
    private insumoService: InsumoService
  ) {}

  ngOnInit() {
    this.cargar();
    this.cargarInsumos();

    const hoy = new Date();
    this.fechaMin=hoy.toISOString().split('T')[0];
  }

  cargar() {
    this.inventarioService.obtenerVistaBodeguero()
      .subscribe(data => this.inventario = data);
  }

  verLotes(i:any){
    this.insumoSeleccionado = i;
    this.inventarioService.obtenerLotes(i.insumoId)
      .subscribe(data => {
        this.lotes = data;
        this.mostrarLotes = true;
      });
  }

  ingresar(){

    if(this.cantidad === null || this.cantidad <= 0 || !this.fecha){
      return;
    }

    const fecha = new Date(this.fecha);
    fecha.setHours(23, 59, 0, 0);

    const fechaFormateada = fecha.toISOString().slice(0,19);

    this.inventarioService
      .ingresarStock(
        this.insumoSeleccionado.insumoId,
        this.cantidad,
        fechaFormateada
      )
      .subscribe(() => {
        this.mostrarIngreso = false;
        this.cargar();
      });
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
        this.cargar();
      });
  }

  abrirIngreso(i:any){
    this.insumoSeleccionado = i;
    this.cantidad = null;
    this.fecha = '';
    this.mostrarIngreso = true;
  }

  abrirSurtir(i:any){
    this.insumoSeleccionado = i;
    this.cantidad = null;
    this.mostrarSurtir = true;
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
    fecha.setHours(23, 59, 0, 0);

    const fechaFormateada = fecha.toISOString().slice(0,19);

    this.inventarioService
      .ingresarStock(
        this.insumoIdSeleccionado,
        this.cantidad,
        fechaFormateada
      )
      .subscribe({
        next: () => {
          this.mostrarIngresoGlobal = false;
          this.cargar();
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  cargarInsumos() {
    this.insumoService.obtenerInsumos().subscribe({
      next: data => this.insumos = data,
      error: err => console.error(err)
    });
  }

  bloquearNegativos(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
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

get inventarioFiltrado() {
  const t = this.busquedaInventario.toLowerCase().trim();

  if (!t) return this.inventario;

  return this.inventario.filter(i => {
    return (
      i.insumoNombre?.toLowerCase().includes(t) ||
      i.insumoId?.toString().includes(t) ||
      i.stockTotal?.toString().includes(t) ||
      i.stockCocina?.toString().includes(t) ||
      i.stockBodega?.toString().includes(t)
    );
  });
}
}