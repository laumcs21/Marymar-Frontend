export interface InventarioResponseDTO {
  id: number;
  insumoNombre: string;
  unidad: string;
  stock: number;
}

export interface InventarioCreateDTO {
  insumoId: number;
  stock: number;
}

export interface InventarioUpdateDTO {
  stock: number;
}

export interface InventarioBodegueroDTO {
  inventarioId: number;
  insumoId: number;
  insumoNombre: string;
  stockTotal: number;
  stockCocina: number;
  stockBodega: number;
}

export interface LoteDTO {
  id: number;
  cantidadInicial: number;
  cantidadDisponible: number;
  ubicacion: string;
  fechaIngreso: string;
  fechaVencimiento: string;
}