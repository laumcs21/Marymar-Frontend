import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MesaService } from '../../../../core/services/mesa.service';
import { Mesa } from '../../../../core/models/mesa.model';

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
    private mesaService: MesaService
  ) {}

  ngOnInit(): void {
    this.cargarMesas();
  }

  cargarMesas() {
    this.mesaService.obtenerTodas().subscribe({
      next: (data) => {
        console.log('DATA Backend:', data);
        const activas = (data || []).filter(m => m.activa);

        this.mesas = activas;
        this.salon = activas.slice(0, 4);
        this.terraza = activas.slice(4);

        console.log('Mesas activas:', activas);
        console.log('Salón:', this.salon);
        console.log('Terraza:', this.terraza);
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
      case 'OCUPADA':
        return 'bg-primary text-white';
      case 'CUENTA_PEDIDA':
        return 'bg-accent-orange text-white';
      default:
        return 'bg-white text-primary border border-primary/10';
    }
  }

  getTextoSecundario(mesa: Mesa): string {
    switch (mesa.estado) {
      case 'DISPONIBLE':
        return `${mesa.capacidad ?? 4} pax`;
      case 'OCUPADA':
        return 'En servicio';
      case 'CUENTA_PEDIDA':
        return 'Pendiente cobro';
      default:
        return '';
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