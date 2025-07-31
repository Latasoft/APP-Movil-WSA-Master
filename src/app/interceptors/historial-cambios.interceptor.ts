import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HistorialCambiosService } from '../services/historial-cambios.service';
import { AuthService } from '../services/auth.service';

export const historialCambiosInterceptor: HttpInterceptorFn = (req, next) => {
  const historialService = inject(HistorialCambiosService);
  const authService = inject(AuthService);

  // Solo interceptar requests específicos que requieren logging
  const shouldLog = req.url.includes('/embarcaciones') && 
                   (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE');

  if (!shouldLog) {
    return next(req);
  }

  // Obtener IP del usuario (simulada)
  const userIP = 'N/A'; // En producción, esto vendría del servidor

  return next(req).pipe(
    tap({
      next: (response) => {
        // El logging específico se maneja en cada servicio
        // Este interceptor puede usarse para logging adicional si es necesario
      },
      error: (error) => {
        console.error('Error en request interceptado:', error);
      }
    })
  );
};