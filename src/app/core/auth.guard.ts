import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated(); // método que verifica si el token existe o es válido

  if (!isAuthenticated) {
    router.navigate(['/login']); // redirige si no está logueado
    return false;
  }

  return true;
};
