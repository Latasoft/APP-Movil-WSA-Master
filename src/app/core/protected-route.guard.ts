import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const protectedRouteGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as string[]; // roles esperados desde el route
  const currentRole = authService.getRoleFromToken();

  if (!currentRole || !expectedRoles.includes(currentRole)) {
    router.navigate(['/']); // redirige si el rol no es permitido
    return false;
  }

  return true;
};
