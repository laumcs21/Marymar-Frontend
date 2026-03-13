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