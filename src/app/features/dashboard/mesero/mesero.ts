import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PersonaService } from '../../../core/services/persona.service';

@Component({
  selector: 'app-mesero',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './mesero.html',
  styleUrls: ['./mesero.css'],
})
export class MeseroComponent implements OnInit {

  nombreMesero = '';

  constructor(
    private router: Router,
    private personaService: PersonaService
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.personaService.miPerfil().subscribe({
      next: (data) => {
        this.nombreMesero = data.nombre;
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
      }
    });
  }

  irPerfil() {
    this.router.navigate(['/dashboard/mesero/perfil']);
  }

  irMesas() {
    this.router.navigate(['/dashboard/mesero']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }
}