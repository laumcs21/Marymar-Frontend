import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  template: `<p>Iniciando sesión con Google...</p>`,
})
export class OAuthCallbackComponent implements OnInit {

  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) return;

    const hash = window.location.hash.replace('#', '');
    const params = new URLSearchParams(hash);

    const token = params.get('token');
    const rol = params.get('rol');

    if (!token || !rol) {
      this.router.navigate(['/login']);
      return;
    }

    localStorage.setItem('token', token);
    localStorage.setItem('rol', rol);

    if (rol === 'ADMINISTRADOR') {
      this.router.navigate(['/dashboard/administrador']);
    } 
    else if (rol === 'CLIENTE') {
      this.router.navigate(['/dashboard/cliente']);
    } 
    else if (rol === 'MESERO') {
      this.router.navigate(['/dashboard/mesero']);
    } 
    else {
      this.router.navigate(['/login']);
    }
  }
}