import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { authInterceptorInterceptor } from './app/intercept/auth-interceptor.interceptor';
import { historialCambiosInterceptor } from './app/interceptors/historial-cambios.interceptor';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { HttpClient, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import './ionicons-loader'; // Importa el archivo de registro de íconos
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(
      withInterceptors([authInterceptorInterceptor, historialCambiosInterceptor])
    ),
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
