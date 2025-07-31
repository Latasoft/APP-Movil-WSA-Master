import { Routes } from '@angular/router';
import { ListaUsuariosComponent } from './components/lista-usuarios/lista-usuarios.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ListaEmbarcacionesClienteComponent } from './components/lista-embarcaciones-cliente/lista-embarcaciones-cliente.component';
import { ListaEmbarcacionesComponent } from './components/lista-embarcaciones/lista-embarcaciones.component';
import { GrupoComponent } from './pages/grupo/grupo.component';
import { ListaGruposComponent } from './components/lista-grupos/lista-grupos.component';
import { authGuard } from './core/auth.guard';
import { protectedRouteGuard } from './core/protected-route.guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ListaDescargaReportesComponent } from './components/lista-descarga-reportes/lista-descarga-reportes.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'usuarios',
    loadComponent: () =>
      import('./pages/usuarios/usuarios.page').then(
        (m) => m.UsuariosPage
      ),
    canActivate: [authGuard, protectedRouteGuard],
    data: { roles: ['ADMINISTRADOR'] },
  },
  {
    path: 'lista-usuarios',
    component: ListaUsuariosComponent,
    runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
    canActivate: [authGuard, protectedRouteGuard],
    data: { roles: ['ADMINISTRADOR'] },
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [authGuard, protectedRouteGuard],
    data: { roles: ['CLIENTE'] },
  },
  {
    path: 'embarcaciones',
    loadComponent: () =>
      import('./pages/embarcaciones/embarcaciones.page').then(
        (m) => m.EmbarcacionesPage
      ),
    canActivate: [authGuard, protectedRouteGuard],
    data: { roles: ['ADMINISTRADOR', 'TRABAJADOR'] },
  },
  {
    path: 'embarcaciones/:_id',
    loadComponent: () =>
      import('./pages/embarcaciones/embarcaciones.page').then(
        (m) => m.EmbarcacionesPage
      ),
    canActivate: [authGuard, protectedRouteGuard],
    data: { roles: ['ADMINISTRADOR', 'TRABAJADOR'] },
  },
  {
    path: 'mis-embarcaciones',
    component: ListaEmbarcacionesClienteComponent,
    canActivate: [authGuard, protectedRouteGuard],
    data: { roles: ['CLIENTE'] },
  },
  {
    path: 'lista-embarcaciones',
    component: ListaEmbarcacionesComponent,
    canActivate: [authGuard, protectedRouteGuard],
    data: { roles: ['ADMINISTRADOR', 'TRABAJADOR'] },
  },
  {
    path: 'grupo',
    component: GrupoComponent,
    canActivate: [authGuard, protectedRouteGuard],
    data: { roles: ['ADMINISTRADOR'] },
  },
  {
    path: 'grupo/:_id',
    component: GrupoComponent,
    canActivate: [authGuard, protectedRouteGuard],
    data: { roles: ['ADMINISTRADOR'] },
  },
  {
    path: 'lista-grupos',
    component: ListaGruposComponent,
    canActivate: [authGuard, protectedRouteGuard],
    data: { roles: ['ADMINISTRADOR', 'TRABAJADOR'] },
  },
  {
    path: 'chat/:id',
    loadComponent: () =>
      import('./pages/chat/chat.page').then((m) => m.ChatPage),
    canActivate: [authGuard, protectedRouteGuard],
    data: { roles: ['ADMINISTRADOR', 'TRABAJADOR'] },
  },
  {
    path: 'generar-reporte',
    loadComponent: () =>
      import('./pages/generar-reporte/generar-reporte.page').then(
        (m) => m.GenerarReportePage
      ),
    canActivate: [authGuard, protectedRouteGuard],
    data: { roles: ['ADMINISTRADOR'] },
  },
  {
    path: 'lista-descarga-reportes',
    component: ListaDescargaReportesComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'soporte',
    loadComponent: () =>
      import('./ajustes/soporte/soporte.page').then(
        (m) => m.SoportePage
      ),
  },
  {
    path: 'servicios',
    loadComponent: () =>
      import('./ajustes/servicios/servicios.page').then(
        (m) => m.ServiciosPage
      ),
  },
  {
    path: 'detalle-servicio',
    loadComponent: () =>
      import('./modals/detalle-servicio/detalle-servicio.page').then(
        (m) => m.DetalleServicioPage
      ),
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./change-password/change-password.page').then(
        (m) => m.ChangePasswordPage
      ),
  },
  {
    path: 'gestionar-clientes',
    loadComponent: () =>
      import('./pages/gestionar-clientes/gestionar-clientes.page').then(
        (m) => m.GestionarClientesPage
      ),
  },
  {
    path: 'modal-cliente',
    loadComponent: () =>
      import('./modals/modal-cliente/modal-cliente.page').then(
        (m) => m.ModalClientePage
      ),
  },
  {
    path: 'detalle-cliente',
    loadComponent: () =>
      import('./modals/detalle-cliente/detalle-cliente.page').then(
        (m) => m.DetalleClientePage
      ),
  },

  // ✅ Todas las rutas de tipos-de-reporte
  {
    path: 'total-vessels-reports',
    loadComponent: () =>
      import('./pages/tipos-de-reportes/total-vessels-reports/total-vessels-reports.page').then(
        (m) => m.TotalVesselsReportsPage
      ),
  },
 {
  path: 'vessels-by-customer',
  loadComponent: () =>
    import('./pages/tipos-de-reportes/vessels-by-customer/vessels-by-customer.page').then(
      (m) => m.VesselsByCustomerPage
    )
}
,
  {
    path: 'vessels-by-country',
    loadComponent: () =>
      import('./pages/tipos-de-reportes/vessels-by-country/vessels-by-country.page').then(
        (m) => m.VesselsByCountryPage
      ),
  },
  {
    path: 'vessels-reports',
    loadComponent: () =>
      import('./pages/tipos-de-reportes/vessels-reports/vessels-reports.page').then(
        (m) => m.VesselsReportsPage
      ),
  },
  {
    path: 'vessels-by-services',
    loadComponent: () =>
      import('./pages/tipos-de-reportes/vessels-by-services/vessels-by-services.page').then(
        (m) => m.VesselsByServicesPage
      ),
  },
  {
    path: 'vessels-by-operator',
    loadComponent: () =>
      import('./pages/tipos-de-reportes/vessels-by-operator/vessels-by-operator.page').then(
        (m) => m.VesselsByOperatorPage
      ),
  },
  {
  path: 'detalle-naves-cliente',
  loadComponent: () =>
    import('./pages/detalle-naves-cliente/detalle-naves-cliente.page')
      .then((m) => m.DetalleNavesClientePage)
},
  
  {
  path: 'detalle-nave-panel-cliente/:id',
  loadComponent: () =>
    import('./pages/detalle-nave-panel-cliente/detalle-nave-panel-cliente.page').then(
      (m) => m.DetalleNavePanelClientePage
    ),
},
  {
    path: 'historial-cambios',
    loadComponent: () =>
      import('./pages/historial-cambios/historial-cambios.page').then(
        (m) => m.HistorialCambiosPage
      ),
    canActivate: [authGuard, protectedRouteGuard],
    data: { roles: ['ADMINISTRADOR', 'TRABAJADOR'] },
  },

];
