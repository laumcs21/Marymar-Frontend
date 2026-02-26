export interface Persona {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  rol: 'ADMINISTRADOR' | 'CLIENTE' | 'MESERO';
  direccionEnvio?: string;
  salario?: number;
  numeroIdentificacion: string;
  activo: boolean;
}