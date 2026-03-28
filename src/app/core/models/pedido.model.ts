export interface DetallePedido {
  id: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  productoId:number;
}

export interface Pedido {
  id: number;
  fecha: string;
  estado: string;
  tipo: string;

  clienteNombre?: string;

  meseroId: number;
  meseroNombre: string;

  mesaId?: number;
  numeroMesa?: number;

  total: number;
  detalles: DetallePedido[];
}