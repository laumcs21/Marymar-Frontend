export interface Mesa {
  id: number;
  numero: number;
  estado: string;
  activa: boolean;
  capacidad?: number | null;
  meseroAsignadoId?: number | null;
  meseroAsignadoNombre?: string | null;
}