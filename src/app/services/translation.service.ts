import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TranslationKeys {
  welcome: string;
  adminPanel: string;
  workerPanel: string;
  clientPanel: string;
  manageUsers: string;
  manageClients: string;
  manageVessels: string;
  viewReports: string;
  manageGroups: string;
  reportHistory: string;
  manageServices: string;
  myProfile: string;
  myVessels: string;
  myGroups: string;
  logout: string;
  logoutConfirm: string;
  logoutMessage: string;
  cancel: string;
  continue: string;
  quickAccess: string;
  // Roles de usuario
  roleAdmin: string;
  roleWorker: string;
  roleClient: string;
  roleAssistant: string;
  roleAdministrative: string;
  // Descripciones de las tarjetas
  manageUsersDesc: string;
  manageClientsDesc: string;
  manageVesselsDesc: string;
  viewReportsDesc: string;
  manageGroupsDesc: string;
  reportHistoryDesc: string;
  manageServicesDesc: string;
  myProfileDesc: string;
  myVesselsDesc: string;
  myGroupsDesc: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage = new BehaviorSubject<'es' | 'en'>('es');
  private translations: { [key: string]: TranslationKeys } = {
    es: {
      welcome: 'Bienvenido',
      adminPanel: 'Panel Administrador',
      workerPanel: 'Panel Trabajador',
      clientPanel: 'Panel Cliente',
      manageUsers: 'Gestionar Usuarios',
      manageClients: 'Gestionar Clientes',
      manageVessels: 'Gestionar Embarcaciones',
      viewReports: 'Ver Reportes',
      manageGroups: 'Gestionar Grupos',
      reportHistory: 'Historial Reportes descargados',
      manageServices: 'Gestionar Servicios',
      myProfile: 'Mi Perfil',
      myVessels: 'Mis Embarcaciones cliente',
      myGroups: 'Mis Grupos',
      logout: '¿Cerrar sesión?',
      logoutConfirm: '¿Seguro que deseas cerrar sesión?',
      logoutMessage: '¿Seguro que deseas cerrar sesión?',
      cancel: 'Cancelar',
      continue: 'Continuar',
      quickAccess: 'Accede rápidamente a tus funciones principales',
      // Roles de usuario en español
      roleAdmin: 'Administrador',
      roleWorker: 'Trabajador',
      roleClient: 'Cliente',
      roleAssistant: 'Asistente',
      roleAdministrative: 'Administrativo',
      // Descripciones en español
      manageUsersDesc: 'Gestiona usuarios del sistema',
      manageClientsDesc: 'Administra clientes y empresas',
      manageVesselsDesc: 'Controla embarcaciones',
      viewReportsDesc: 'Genera y visualiza reportes',
      manageGroupsDesc: 'Gestiona grupos de trabajo',
      reportHistoryDesc: 'Historial de reportes descargados',
      manageServicesDesc: 'Administra servicios disponibles',
      myProfileDesc: 'Gestiona tu perfil personal',
      myVesselsDesc: 'Visualiza tus embarcaciones',
      myGroupsDesc: 'Accede a tus grupos de trabajo'
    },
    en: {
      welcome: 'Welcome',
      adminPanel: 'Admin Panel',
      workerPanel: 'Worker Panel',
      clientPanel: 'Client Panel',
      manageUsers: 'Manage Users',
      manageClients: 'Manage Clients',
      manageVessels: 'Manage Vessels',
      viewReports: 'View Reports',
      manageGroups: 'Manage Groups',
      reportHistory: 'Downloaded Reports History',
      manageServices: 'Manage Services',
      myProfile: 'My Profile',
      myVessels: 'My Client Vessels',
      myGroups: 'My Groups',
      logout: 'Logout?',
      logoutConfirm: 'Are you sure you want to logout?',
      logoutMessage: 'Are you sure you want to logout?',
      cancel: 'Cancel',
      continue: 'Continue',
      quickAccess: 'Quick access to your main functions',
      // Roles de usuario en inglés
      roleAdmin: 'Administrator',
      roleWorker: 'Worker',
      roleClient: 'Client',
      roleAssistant: 'Assistant',
      roleAdministrative: 'Administrative',
      // Descripciones en inglés
      manageUsersDesc: 'Manage system users',
      manageClientsDesc: 'Manage clients and companies',
      manageVesselsDesc: 'Control vessels',
      viewReportsDesc: 'Generate and view reports',
      manageGroupsDesc: 'Manage work groups',
      reportHistoryDesc: 'Downloaded reports history',
      manageServicesDesc: 'Manage available services',
      myProfileDesc: 'Manage your personal profile',
      myVesselsDesc: 'View your vessels',
      myGroupsDesc: 'Access your work groups'
    }
  };

  constructor() {}

  getCurrentLanguage() {
    return this.currentLanguage.asObservable();
  }

  getCurrentLanguageValue(): 'es' | 'en' {
    return this.currentLanguage.value;
  }

  toggleLanguage() {
    const current = this.currentLanguage.value;
    this.currentLanguage.next(current === 'es' ? 'en' : 'es');
  }

  translate(key: keyof TranslationKeys): string {
    const language = this.currentLanguage.value;
    return this.translations[language][key];
  }

  getTranslation(key: keyof TranslationKeys): string {
    return this.translate(key);
  }
}