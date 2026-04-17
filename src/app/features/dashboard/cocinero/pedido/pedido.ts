import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService} from '../../../../core/services/pedido.service';
import { Pedido } from '../../../../core/models/pedido.model';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.html',
  styleUrls: ['./pedido.css']
})
export class PedidoComponent implements OnInit {

  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  pedidoVista: any = null;
  mostrarModalVista = false;
  pedidosCreados: Pedido[] = [];
  pedidosEnPreparacion: Pedido[] = [];

  filtros = {
    fechaInicio: '',
    fechaFin: '',
    estado: ''
  };

  cargando = false;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

    cargarPedidos() {
      this.pedidoService.obtenerCola('CREADO')
        .subscribe(data => this.pedidosCreados = data);

      this.pedidoService.obtenerCola('EN_PREPARACION')
        .subscribe(data => this.pedidosEnPreparacion = data);
    }


  aplicarFiltros() {
    this.cargando = true;

    this.pedidoService.filtrar(this.filtros).subscribe(data => {
      this.pedidosFiltrados = data;
      this.cargando = false;
    });
  }

  limpiarFiltros() {
    this.filtros = {
      fechaInicio: '',
      fechaFin: '',
      estado: ''
    };

    this.cargarPedidos();
  }

  verPedido(pedido: any) {
  this.pedidoVista = pedido;
  this.mostrarModalVista = true;
}

preparar(id: number) {
  this.pedidoService.cambiarEstado(id, 'EN_PREPARACION')
    .subscribe(() => this.cargarPedidos());
}

finalizar(id: number) {
  this.pedidoService.cambiarEstado(id, 'LISTO')
    .subscribe(() => this.cargarPedidos());
}

cerrarModalVista() {
  this.mostrarModalVista = false;
  this.pedidoVista = null;
}
}