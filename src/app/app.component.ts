import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet,Platform  } from '@ionic/angular/standalone';
import { MenuComponent } from './components/menu/menu.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { NotificacionPushService } from './services/notificacion-push.service';
// Importa el plugin
import { StatusBar, Style } from '@capacitor/status-bar';
import { App as CapacitorApp } from '@capacitor/app';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet,MenuComponent],
})
export class AppComponent implements OnInit {
  isTokenExpired: boolean = false;
  isLoading: boolean = true;
  isAuthenticated: boolean = false;
  rolUsuario: string | null= null;
  private tokenExpirationTimer: any;
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificacionPushService=inject(NotificacionPushService)
  private platform = inject(Platform);
  async ngOnInit(): Promise<void> {
     // 1️⃣ Espera a que Ionic esté listo
     await this.platform.ready();

     // Forzar siempre el modo claro
    document.body.classList.remove('dark');
    document.body.classList.add('light');

     if(this.platform.is('hybrid')){
      // 2️⃣ Desactiva el overlay de la WebView sobre la status‑bar
     await StatusBar.setOverlaysWebView({ overlay: false });

     // 3️⃣ Configura el StatusBar según el tema actual
     this.setupStatusBarBasedOnTheme();
     
       // 👇 Activar botón atrás solo en plataforma móvil
    this.handleBackButton();

     }
     
 
    
    this.checkAuthentication();
  
    if (this.authService.getToken() && !this.authService.isTokenExpired()) {
      await this.notificacionPushService.initPushNotifications(); // esto ya hace platform.ready()
    }
  }

  // Método para configurar la barra de estado según el tema
  async setupStatusBarBasedOnTheme() {
    await StatusBar.setStyle({ style: Style.Dark }); // Íconos oscuros
  await StatusBar.setBackgroundColor({ color: '#14355C' }); // Fondo claro (puede ser #14345C si lo prefieres)
  }
  
  // Método para escuchar cambios de tema
  listenForThemeChanges() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', async (e) => {
       // Independientemente del cambio de tema, mantener el modo claro en la aplicación
    document.body.classList.remove('dark');
    document.body.classList.add('light');
      if (e.matches) {
        // Cambió a modo oscuro
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#000000' });
      } else {
        // Cambió a modo claro
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#14345C' });
      }
    });
  }
  
  
  private handleBackButton(): void {
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      const currentUrl = this.router.url;
  
      if (currentUrl === '/login' || currentUrl === '/home') {
        CapacitorApp.exitApp();
      } else {
        window.history.back();
      }
    });
  }
  
  

  checkAuthentication(): void {
    const token = this.authService.getToken();
    if (token) {
      if (this.authService.isTokenExpired()) {
        this.handleUnauthenticated();
      } else {
        this.isAuthenticated = true;
        this.getRole();
        this.setupTokenExpirationCheck();
        this.isLoading = false;

      }
    } else {
      this.handleUnauthenticated();
    }
  }

  updateRole(role: string): void {
    this.rolUsuario = role;
    this.isAuthenticated = false; // Actualiza el estado de autenticación
  }

  

  getRole(): void {
    this.rolUsuario= this.authService.getRoleFromToken()
    
  }
  private handleUnauthenticated(): void {
    this.isAuthenticated = false;
    this.isLoading = false;
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.redirectToLogin();
  }

  private redirectToLogin(): void {
    if (this.router.url !== '/login') {
      this.router.navigate(['/login']);
    }
  }

  private setupTokenExpirationCheck(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    const expirationDate = this.authService.getTokenExpirationDate();
    if (expirationDate) {
      const timeUntilExpiration = expirationDate.valueOf() - new Date().valueOf();
      
      if (timeUntilExpiration <= 0) {
        this.handleTokenExpiration();
      } else {
        // Configurar el timer para que se active 1 minuto antes de la expiración
        const warningTime = Math.max(0, timeUntilExpiration - 60000);
        this.tokenExpirationTimer = setTimeout(() => {
          this.handleTokenExpiration();
          
        }, warningTime);
      }
    }
  }

  handleTokenExpiration(): void {
    this.isTokenExpired = true;
  }

  handleLogout(): void {
    this.authService.logout();
    this.isTokenExpired = false;
    this.isAuthenticated = false;
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  ngOnDestroy(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    } 
  }

 
}
