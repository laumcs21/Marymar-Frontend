export interface InsumoResponseDTO {
  id: number;
  nombre: string;
  unidad: string;
}

export interface InsumoCreateDTO {
  nombre: string;
  unidad: string;
}