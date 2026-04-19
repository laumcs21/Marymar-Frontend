import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PersonaService } from '../../../core/services/persona.service';
import { AuthService } from '../../../core/services/auth.service';
import { InventarioService } from '../../../core/services/inventario.service';

@Component({
  selector: 'app-bodeguero',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './bodeguero.html',
  styleUrls: ['./bodeguero.css'],
})
export class BodegueroComponent implements OnInit {

  nombreBodeguero = '';
  notificaciones: any[] = [];
  mostrarPanelNotificaciones = false;
  hayNotificaciones = false;

  private intervaloNotificaciones: any;

  constructor(
    private router: Router,
    private personaService: PersonaService,
    private authService: AuthService,
    private inventarioService: InventarioService
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
    this.cargarNotificaciones();

    this.intervaloNotificaciones = setInterval(() => {
      this.cargarNotificaciones();
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.intervaloNotificaciones) {
      clearInterval(this.intervaloNotificaciones);
    }
  }

  toggleNotificaciones() {
    this.mostrarPanelNotificaciones = !this.mostrarPanelNotificaciones;
  }

  cerrarNotificaciones() {
    this.mostrarPanelNotificaciones = false;
  }

  irInventario() {
    this.router.navigate(['/dashboard/bodeguero']);
  }

  cargarPerfil() {
    this.personaService.miPerfil().subscribe({
      next: (data) => {
        this.nombreBodeguero = data.nombre;
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
      }
    });
  }

  irPerfil() {
    this.router.navigate(['/dashboard/bodeguero/perfilBodeguero']);
  }

  cargarNotificaciones() {
    this.inventarioService.obtenerNotificaciones().subscribe({
      next: data => {
        this.notificaciones = data;
        this.hayNotificaciones = data.length > 0;
      },
      error: err => console.error(err)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}