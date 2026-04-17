import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MesaService } from '../../../../core/services/mesa.service';
import { PedidoService } from '../../../../core/services/pedido.service';
import { Mesa } from '../../../../core/models/mesa.model';
import { Pedido } from '../../../../core/models/pedido.model';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mesas.html',
})
export class MesasComponent implements OnInit {

  mesas: Mesa[] = [];
  salon: Mesa[] = [];
  terraza: Mesa[] = [];

  pestanaActiva: 'SALON' | 'TERRAZA' = 'SALON';

  constructor(
    private router: Router,
    private mesaService: MesaService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.cargarMesas();
  }

  cargarMesas() {
    this.mesaService.obtenerTodas().subscribe({
      next: (data) => {
        const activas = (data || []).filter(m => m.activa);

        this.pedidoService.obtenerTodos().subscribe({
          next: (pedidos: Pedido[]) => {
            this.mesas = activas.map((m: Mesa) => {
              const pedidoActivo = pedidos.find((p: Pedido) =>
                p.numeroMesa === m.numero &&
                p.estado !== 'PAGADO' &&
                p.estado !== 'CANCELADO'
              );

              return {
                ...m,
                estado: pedidoActivo ? pedidoActivo.estado : 'DISPONIBLE'
              };
            });

            this.salon = this.mesas.slice(0, 4);
            this.terraza = this.mesas.slice(4);
          },
          error: (err) => {
            console.error('Error cargando pedidos:', err);
            this.mesas = activas;
            this.salon = activas.slice(0, 4);
            this.terraza = activas.slice(4);
          }
        });
      },
      error: (err) => {
        console.error('Error cargando mesas:', err);
      }
    });
  }

  cambiarPestana(tab: 'SALON' | 'TERRAZA') {
    this.pestanaActiva = tab;
  }

  obtenerMesasVisibles(): Mesa[] {
    return this.pestanaActiva === 'SALON' ? this.salon : this.terraza;
  }

  seleccionarMesa(mesa: Mesa) {
    this.router.navigate(['/dashboard/mesero/pedido', mesa.id]);
  }

  getClaseMesa(mesa: Mesa): string {
    switch (mesa.estado) {
      case 'DISPONIBLE':
        return 'bg-status-available border-2 border-green-200 text-primary';

      case 'CREADO':
        return 'bg-primary text-white';

      case 'EN_PREPARACION':
        return 'bg-estado-preparacion text-white';

      case 'LISTO':
        return 'bg-estado-listo text-black';

      case 'ENTREGADO':
        return 'bg-estado-entregado text-white';

      case 'CUENTA_PEDIDA':
        return 'bg-estado-cuenta text-white';

      default:
        return 'bg-white text-primary border border-primary/10';
    }
  }

  getTextoSecundario(mesa: Mesa): string {
    switch (mesa.estado) {
      case 'DISPONIBLE':
        return `${mesa.capacidad ?? 4} pax`;
      case 'CREADO':
        return 'Pedido recibido';
      case 'EN_PREPARACION':
        return 'En cocina';
      case 'LISTO':
        return 'Listo para servir';
      case 'ENTREGADO':
        return 'Servido';
      case 'CUENTA_PEDIDA':
        return 'Pendiente cobro';
      default:
        return '';
    }
  }

  formatearEstado(estado: string): string {
    switch (estado) {
      case 'CUENTA_PEDIDA':
        return 'Cuenta Pedida';
      case 'EN_PREPARACION':
        return 'En preparación';
      default:
        return estado;
    }
  }

  totalLibres(): number {
    return this.mesas.filter(m => m.estado === 'DISPONIBLE').length;
  }

  totalCuentaPedida(): number {
    return this.mesas.filter(m => m.estado === 'CUENTA_PEDIDA').length;
  }

  totalCapacidad(): number {
    return this.mesas.reduce((acc, m) => acc + (m.capacidad ?? 4), 0);
  }
}