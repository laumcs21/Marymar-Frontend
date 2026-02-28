export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  categoriaId: number;
  categoriaNombre: string;
  activo: boolean;
  imagenesUrls?: string[];
  imagenPrincipal?: string;
}