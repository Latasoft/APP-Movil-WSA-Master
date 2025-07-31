import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { IonHeader,
  IonCard,
   IonToolbar,
    IonTitle,
     IonContent,
     IonButtons,
     IonMenuButton,
     IonToggle,
     IonLabel,
     IonItem,
    
  IonIcon,
  IonButton,
  IonAlert } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { TranslationService } from '../services/translation.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { CommonModule } from '@angular/common';
import { IonFooter } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, CommonModule, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonIcon, RouterLink, IonCard, IonButton, IonAlert, IonToggle, IonLabel, IonItem, TranslatePipe, IonFooter],
})
export class HomePage {
  isLoggedIn = false;
  userRole: string = '';  
  showLogoutAlert = false;
  currentLanguage: 'es' | 'en' = 'es';
  puedeCrearNave: boolean = false;
  
  constructor(
    private authService: AuthService, 
    private router: Router,
    public translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {}

  get alertButtons() {
    return [
      { text: this.translationService.getTranslation('cancel'), role: 'cancel', cssClass: 'alert-cancel-marino' },
      { text: this.translationService.getTranslation('continue'), role: 'confirm', cssClass: 'alert-confirm-marino' }
    ];
  }

  // Método para obtener traducciones reactivas
  getTranslation(key: string): string {
    return this.translationService.getTranslation(key as any);
  }

  // Método para obtener el título del panel según el rol
  getPanelTitle(): string {
    switch(this.userRole) {
      case 'ADMINISTRADOR':
        return this.getTranslation('adminPanel');
      case 'TRABAJADOR':
        return this.getTranslation('workerPanel');
      case 'CLIENTE':
        return this.getTranslation('clientPanel');
      default:
        return this.getTranslation('adminPanel');
    }
  }

  ionViewWillEnter() {
    // Nos suscribimos al BehaviorSubject isAuthenticated
    // para enterarnos de cualquier cambio (login/logout).
    this.authService.isAuthenticated().subscribe((auth) => {
      this.userRole = this.getUserRole() ?? '';
      this.isLoggedIn = auth;
      
      // Obtener información del usuario para verificar puede_crear_nave
      if (auth) {
        const userData = this.authService.getDecodedToken();
        this.puedeCrearNave = userData?.puede_crear_nave || false;
      }
    });

    // Suscribirse a cambios de idioma
    this.translationService.getCurrentLanguage().subscribe(lang => {
      this.currentLanguage = lang;
      // Forzar la detección de cambios
      this.cdr.detectChanges();
    });
  }

  getUserRole(){
    return this.authService.getRoleFromToken();
  }

  // Método para obtener la clave de traducción del rol
  getRoleTranslationKey(role: string): string {
    if (!role) return '';
    
    // Convertir el rol a formato de clave de traducción
    // Por ejemplo: 'ADMIN' -> 'roleAdmin'
    console.log('Role original:', role);
    
    // Mapeo de roles a claves de traducción
    const roleMap: {[key: string]: string} = {
      'ADMIN': 'roleAdmin',
      'ADMINISTRADOR': 'roleAdmin',
      'CLIENTE': 'roleClient',
      'TRABAJADOR': 'roleWorker',
      'ASISTENTE': 'roleAssistant',
      'ADMINISTRATIVO': 'roleAdministrative'
    };
    
    // Usar el mapeo o construir la clave directamente
    const translationKey = roleMap[role] || ('role' + role);
    console.log('Translation key:', translationKey);
    return translationKey;
  }

  toggleLanguage() {
    this.translationService.toggleLanguage();
  }

  confirmLogout() {
    this.showLogoutAlert = true;
  }

  handleLogoutConfirm(ev: any) {
    if (ev.detail.role === 'confirm') {
      this.authService.logout().subscribe(() => {
        this.router.navigate(['/login']);
      });
    }
    this.showLogoutAlert = false;
  }

}
