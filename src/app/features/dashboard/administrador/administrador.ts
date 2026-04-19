import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { InventarioService } from '../../../core/services/inventario.service';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterModule],
  templateUrl: './administrador.html',
  styleUrls: ['./administrador.css'],
})
export class AdminComponent implements OnInit {

  rol!: string | null;
  notificaciones: any[] = [];
  mostrarPanelNotificaciones = false;
  hayNotificaciones = false;

  private intervaloNotificaciones: any;

  constructor(private router: Router, private authService: AuthService, private inventarioService: InventarioService
  ) {}

  ngOnInit() {
    this.rol = localStorage.getItem('rol');
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

  cerrarNotificaciones() {
  this.mostrarPanelNotificaciones = false;
}
}