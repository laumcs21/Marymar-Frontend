import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonaService } from '../../../../core/services/persona.service';

@Component({
  selector: 'app-perfil-mesero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfilMesero.html',
  styleUrls: ['./perfilMesero.css']
})
export class PerfilMeseroComponent implements OnInit {

  usuario: any = {};
  usuarioOriginal: any = {};

  cargando = false;
  mensaje = '';
  error = '';

  modoEdicion = false;

  mostrarPassword = false;
  tipoInputPassword = 'password';
  mostrarReglasPassword = false;

  constructor(private personaService: PersonaService) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.mensaje = '';
    this.personaService.miPerfil().subscribe({
      next: (data) => {
        this.usuario = {
          ...data,
          contrasena: ''
        };

        this.usuarioOriginal = {
          ...data,
          contrasena: ''
        };
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
        this.error = 'No se pudo cargar la información del perfil';
      }
    });
  }

  activarEdicion() {
    this.modoEdicion = true;
    this.mensaje = '';
    this.error = '';
  }

  volverPerfil() {
    this.modoEdicion = false;
    this.mensaje = '';
    this.error = '';
    this.usuario = {
      ...this.usuarioOriginal,
      contrasena: ''
    };
    this.mostrarReglasPassword = false;
    this.mostrarPassword = false;
    this.tipoInputPassword = 'password';
  }

  guardar() {
    this.cargando = true;
    this.mensaje = '';
    this.error = '';

    const payload = {
      ...this.usuario
    };

    if (!payload.contrasena || payload.contrasena.trim() === '') {
      delete payload.contrasena;
    } else {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

      if (!regex.test(payload.contrasena)) {
        this.error = 'La contraseña no cumple los requisitos';
        this.cargando = false;
        return;
      }
    }

    this.personaService.actualizar(this.usuario.id, payload).subscribe({
      next: (data) => {
        this.cargando = false;
        this.mensaje = 'Perfil actualizado correctamente';
        this.modoEdicion = false;

        this.usuario = {
          ...data,
          contrasena: ''
        };

        this.usuarioOriginal = {
          ...data,
          contrasena: ''
        };
      },
      error: (err) => {
        console.error('Error actualizando perfil:', err);
        this.cargando = false;
        this.error = err.error?.message || 'Error al actualizar el perfil';
      }
    });
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
    this.tipoInputPassword = this.mostrarPassword ? 'text' : 'password';
  }

  activarPassword() {
    this.mostrarReglasPassword = true;
  }

  ocultarReglasConDelay() {
    setTimeout(() => {
      this.mostrarReglasPassword = false;
    }, 200);
  }

  formatearFecha(fecha: string | null | undefined): string {
    if (!fecha) return 'No registrada';

    try {
      return new Date(fecha).toLocaleDateString('es-CO');
    } catch {
      return fecha;
    }
  }

  textoSiVacio(valor: any): string {
    if (valor === null || valor === undefined || valor === '') {
      return 'No registrado';
    }
    return valor;
  }
}