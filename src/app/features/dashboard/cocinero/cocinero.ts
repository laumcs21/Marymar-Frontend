import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PersonaService } from '../../../core/services/persona.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cocinero',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './cocinero.html',
  styleUrls: ['./cocinero.css'],
})
export class CocineroComponent implements OnInit {

  nombreCocinero = '';

  constructor(
    private router: Router,
    private personaService: PersonaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.personaService.miPerfil().subscribe({
      next: (data) => {
        this.nombreCocinero = data.nombre;
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
      }
    });
  }

  irPerfil() {
    this.router.navigate(['/dashboard/cocinero/perfil']);
  }

  irPedidos() {
    this.router.navigate(['/dashboard/cocinero']);
  }

logout() {
  this.authService.logout();
  this.router.navigate(['/login']);
}
}