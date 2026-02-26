import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {

    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    if (rol !== 'CLIENTE') {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}