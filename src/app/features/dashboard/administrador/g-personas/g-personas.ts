import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PersonaService } from '../../../../core/services/persona.service';
import { Persona } from '../../../../core/models/persona.model';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormsModule
} from '@angular/forms';

@Component({
  selector: 'app-g-personas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './g-personas.html',
  styleUrls: ['./g-personas.css']
})

export class GPersonasComponent implements OnInit {

  usuarios: Persona[] = [];
  mostrarModal = false;
  form!: FormGroup;
  serverError: string | null=null;
  modoEdicion = false;
  usuarioEditandoId : number | null = null;
  filtroRol: string = '';
  busqueda: string = '';
  usuariosFiltrados: Persona [] =[];
  usuarioVista: Persona | null = null;
  mostrarModalVista = false;
  menuAbierto: number | null = null;
  mostrarPassword = false;
  mostrarReglasPassword = false;
  fechaMaxima: string = new Date().toISOString().split('T')[0];
  tipoInputPassword: string = 'text';

  constructor(
    private personaService: PersonaService,
    private router: Router,
    private fb: FormBuilder

  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        numeroIdentificacion: ['', Validators.required],
        nombre: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        contrasena: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
          ]
        ],
        telefono: [''],
        fechaNacimiento: ['', Validators.required],
        rol: ['', Validators.required],
        salario: [null],
        direccionEnvio: ['']
      },
      { validators: this.mayorEdadSiAdminOMeseroValidator }
    );

    this.form.get('rol')!.valueChanges.subscribe((rol) => {
      const salario = this.form.get('salario')!;
      salario.clearValidators();

      if (rol === 'ADMINISTRADOR' || rol === 'MESERO') {
        salario.setValidators([Validators.required, Validators.min(0)]);
      }

      salario.updateValueAndValidity();

      const direccionEnvio = this.form.get('direccionEnvio')!;
        direccionEnvio.clearValidators();
        if (rol === 'CLIENTE') {
          direccionEnvio.setValidators([Validators.required]);
        }
        direccionEnvio.updateValueAndValidity();

      this.form.updateValueAndValidity();
        });

    this.cargarUsuarios();
  }

  abrirModal() {
    this.modoEdicion = false;
    this.mostrarModal = true;
    this.form.reset();
    const contrasena =
    this.form.get('contrasena')!;
    contrasena.setValidators([
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
    ]);
    contrasena.updateValueAndValidity();
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.form.reset();
    this.modoEdicion = false;
    this.usuarioEditandoId = null;
    this.serverError = '';
  }

guardarUsuario() {

  Object.keys(this.form.controls).forEach(key => {
  const control = this.form.get(key);
  if (control?.invalid) {
    console.log("Control inválido:", key, control.errors);
  }
});

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const payload: any = { ...this.form.value };

  if (this.modoEdicion) {
    if (!payload.contrasena || String(payload.contrasena).trim() === '') {
      delete payload.contrasena;
    }
  }

  if (this.modoEdicion && this.usuarioEditandoId) {
    this.personaService.actualizar(this.usuarioEditandoId, payload).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cerrarModal();
      },
      error: (err) => this.manejarErrorBackend(err)
    });
  } else {
    this.personaService.crearDesdeAdmin(payload).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cerrarModal();
      },
      error: (err) => this.manejarErrorBackend(err)
    });
  }
}

private manejarErrorBackend(err: any) {

  const mensaje = err.error?.message;

  if (!mensaje) {
    this.serverError = 'Error inesperado del servidor';
    return;
  }

  if (mensaje.includes('correo')) {
    this.form.get('email')?.setErrors({ duplicado: true });
  }

  if (mensaje.includes('identificación')) {
    this.form.get('numeroIdentificacion')?.setErrors({ duplicado: true });
  }

  this.serverError = mensaje;
}

    cargarUsuarios() {
      this.personaService.obtenerTodas().subscribe({
        next: (data) => {
          this.usuarios = data;
          this.aplicarFiltros();
        }
      });
    }

    private normalizar(texto: string): string {
  return texto
    ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    : '';
}

  aplicarFiltros() {

    this.usuariosFiltrados = this.usuarios.filter(usuario => {

      const coincideRol = this.filtroRol
        ? usuario.rol === this.filtroRol
        : true;

      const textoBusqueda = this.normalizar(this.busqueda);

      const coincideBusqueda =
        this.normalizar(usuario.nombre).includes(textoBusqueda) ||
        this.normalizar(usuario.numeroIdentificacion).includes(textoBusqueda);

      return coincideRol && coincideBusqueda;
    });
  }

  limpiarFiltros() {
    this.busqueda = '';
    this.filtroRol = '';
    this.aplicarFiltros();
  }

    formatearRol(rol: string): string {
    switch (rol) {
      case 'ADMINISTRADOR': return 'Admin';
      case 'MESERO': return 'Mesero';
      case 'CLIENTE': return 'Cliente';
      default: return rol;
    }
  }

  eliminarUsuario(id: number) {
    this.personaService.eliminar(id).subscribe(() => this.cargarUsuarios());
  }

  private mayorEdadSiAdminOMeseroValidator(group: AbstractControl): ValidationErrors | null {
    const rol = group.get('rol')?.value;
    const fecha = group.get('fechaNacimiento')?.value;

    if (!rol || !fecha) return null;
    if (rol !== 'ADMINISTRADOR' && rol !== 'MESERO') return null;

    const nacimiento = new Date(fecha);
    const hoy = new Date();

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;

    return edad < 18 ? { menorEdadRol: true } : null;
  }

  editarUsuario(usuario: Persona) {
  this.modoEdicion = true;
  this.usuarioEditandoId = usuario.id;
  this.mostrarModal = true;

  this.form.patchValue({
    numeroIdentificacion: usuario.numeroIdentificacion,
    nombre: usuario.nombre,
    email: usuario.email,
    fechaNacimiento: usuario.fechaNacimiento,
    rol: usuario.rol,
    salario: usuario.salario,
    direccionEnvio: (usuario as any).direccionEnvio ?? ''
  });

  const contrasena = this.form.get('contrasena')!;
  contrasena.setValue('');
  contrasena.clearValidators();
  contrasena.updateValueAndValidity();
}

toggleEstado(usuario: Persona) {
  this.personaService.cambiarEstado(usuario.id, !usuario.activo)
    .subscribe({
      next: () => {
        usuario.activo = !usuario.activo;
      },
      error: err => console.error(err)
    });
}

toggleMenu(id: number) {
  this.menuAbierto = this.menuAbierto === id ? null : id;
}

verUsuario(usuario: Persona) {
  this.usuarioVista = usuario;
  this.mostrarModalVista = true;
}

cerrarModalVista() {
  this.mostrarModalVista = false;
  this.usuarioVista = null;
}

cerrarMenu(){
  this.menuAbierto = null;
}

ocultarReglasConDelay() {
  setTimeout(() => {
    this.mostrarReglasPassword = false;
  }, 150);
}

activarPassword() {
  if (this.tipoInputPassword !== 'password') {
    this.tipoInputPassword = 'password';
  }
}

togglePassword() {
  this.mostrarPassword = !this.mostrarPassword;
  this.tipoInputPassword = this.mostrarPassword ? 'text' : 'password';
}

}