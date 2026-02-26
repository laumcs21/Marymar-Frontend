import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {

  const router = inject(Router);

  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  if (rol !== 'ADMINISTRADOR') {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};