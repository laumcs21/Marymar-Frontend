import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PedidoService } from '../../../../core/services/pedido.service';
import { PagoService } from '../../../../core/services/pago.service';
import { ProductoService } from '../../../../core/services/producto.service';
import { PersonaService } from '../../../../core/services/persona.service';
import { MesaService } from '../../../../core/services/mesa.service';

import { Pedido } from '../../../../core/models/pedido.model';
import { Producto } from '../../../../core/models/producto.model';


@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.html'
})
export class PedidoComponent implements OnInit {

  pedido!: Pedido;
  mesaId!: number;

  productos: any[] = [];
  categorias: any[] = [];
  busqueda = '';
  categoriaSeleccionada: number | null = null;

  archivo: File | null = null;
  metodoPago = '';

  cargandoPago = false;
  errorPago: string | null = null;
  exitoPago: string | null = null;

  mostrarModalCancelar = false;
  cargandoCancelacion = false;

  mostrarModalError = false;
  mensajeError = '';
  productosActivos: Producto[] = []
  

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private productoService: ProductoService,
    private pagoService: PagoService,
    private personaService: PersonaService,
    private router: Router,
    private mesaService: MesaService
  ) {}

  ngOnInit() {
    this.mesaId = Number(this.route.snapshot.paramMap.get('mesaId'));
    this.abrirPedido();
    this.cargarProductos();
  }

  // =========================
  // PEDIDO
  // =========================
  cargarPedido() {
    this.pedidoService.obtenerPorMesa(this.mesaId)
      .subscribe(data => this.pedido = data);
  }

  abrirPedido() {
    this.personaService.miPerfil().subscribe(usuario => {
      const meseroId = usuario.id;

      this.mesaService.abrirMesa(this.mesaId, meseroId)
        .subscribe({
          next: () => this.cargarPedido(),
          error: () => this.cargarPedido()
        });
    });
  }

  volverMesas() {
    this.router.navigate(['/dashboard/mesero']);
  }

  // =========================
  // PRODUCTOS
  // =========================
  cargarProductos() {
    this.productoService.obtenerTodos().subscribe(data => {
      this.productos = data.filter(p => p.activo === true)

      this.categorias = [
        ...new Map(data.map(p => [p.categoriaId, {
          id: p.categoriaId,
          nombre: p.categoriaNombre
        }])).values()
      ];
    });
  }

  productosFiltrados() {
    return this.productos.filter(p => {
      const coincideBusqueda = p.nombre.toLowerCase().includes(this.busqueda.toLowerCase());
      const coincideCategoria =
        this.categoriaSeleccionada === null ||
        p.categoriaId === this.categoriaSeleccionada;

      return coincideBusqueda && coincideCategoria;
    });
  }

  filtrarPorCategoria(catId: number) {
    this.categoriaSeleccionada = catId;
  }

agregarProducto(p: any) {
  this.pedidoService.agregarProducto(this.pedido.id, p.id)
    .subscribe({
      next: () => this.cargarPedido(),

      error: (err) => {
        this.mostrarErrorStock(err.error?.message || 'Stock insuficiente');
      }
    });
}

  disminuir(d: any) {
    this.pedidoService.disminuirProducto(this.pedido.id, d.productoId)
      .subscribe(() => this.cargarPedido());
  }

  eliminar(d: any) {
    this.pedidoService.eliminarDetalle(this.pedido.id, d.id)
      .subscribe(() => this.cargarPedido());
  }

  mostrarErrorStock(msg: string) {
  this.mensajeError = msg;
  this.mostrarModalError = true;
}

  cambiarCantidad(d: any, cambio: number) {
    if (cambio === -1) {
      this.disminuir(d);
    } else {
      this.pedidoService.agregarProducto(this.pedido.id, d.productoId)
        .subscribe(() => this.cargarPedido());
    }
  }

  // =========================
  // ARCHIVO
  // =========================
  onFileSelected(e: any) {
    this.archivo = e.target.files[0];
  }

  // =========================
  // PAGO
  // =========================
  pagar() {

    this.errorPago = null;
    this.exitoPago = null;

    if (!this.metodoPago) {
      this.errorPago = 'Debes seleccionar un método de pago';
      return;
    }

    if (this.metodoPago === 'TRANSFERENCIA' && !this.archivo) {
      this.errorPago = 'Debes subir comprobante';
      return;
    }

    if (!this.pedido?.detalles?.length) {
      this.errorPago = 'No hay productos en el pedido';
      return;
    }

    this.cargandoPago = true;

    this.pagoService.pagar(
      this.pedido.id,
      this.metodoPago,
      this.pedido.total,
      this.archivo ?? undefined
    ).subscribe({

      next: () => {

        this.cargandoPago = false;
        this.exitoPago = 'Pago realizado correctamente';

        this.metodoPago = '';
        this.archivo = null;
        setTimeout(() => {
          this.router.navigate(['/dashboard/mesero']);
        }, 1200);
      },

      error: (err) => {
        this.cargandoPago = false;
        this.errorPago = err.error?.message || 'Error al procesar el pago';
      }

    });
  }

  // =========================
  // MODAL CANCELAR
  // =========================
  cancelarMesa() {
    this.mostrarModalCancelar = true;
  }

  confirmarCancelacion() {

    this.cargandoCancelacion = true;

    this.mesaService.cancelarMesa(this.mesaId)
      .subscribe({
        next: () => {
          this.cargandoCancelacion = false;
          this.mostrarModalCancelar = false;
          this.router.navigate(['/dashboard/mesero']);
        },
        error: () => {
          this.cargandoCancelacion = false;
        }
      });
  }

  cerrarModal() {
    this.mostrarModalCancelar = false;
  }

  generarFactura() {
  if (!this.pedido?.id) return;

  this.pedidoService.descargarFactura(this.pedido.id);
}

  generarComanda() {
    if (!this.pedido?.id) return;

    this.pedidoService.descargarComanda(this.pedido.id);
  }
}