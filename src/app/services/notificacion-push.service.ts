import { Injectable } from '@angular/core';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NotificacionPushService {
  private apiUrl = `${environment.apiUrl}/users/fcm-token`;

  constructor(private platform: Platform, private http: HttpClient) {}

  async initPushNotifications() {
    await this.platform.ready();
  
    // Evitar ejecución en navegador
    if (!Capacitor.isNativePlatform()) {
      console.warn('⛔ Notificaciones push solo están habilitadas en móviles.');
      return;
    }
  
    try {
      const permission = await FirebaseMessaging.requestPermissions();
      console.log('Permisos de notificación:', permission);
  
      if (permission.receive !== 'granted') {
        console.warn('🚫 Permiso de notificaciones no otorgado');
        return;
      }
  
      const { token } = await FirebaseMessaging.getToken();
      console.log('📲 Token FCM:', token);
  
      this.saveTokenToBackend(token);
  
      FirebaseMessaging.addListener('notificationReceived', ({ notification }) => {
        console.log('📥 Notificación recibida en foreground:', notification);
      });
    } catch (error) {
      console.error('❌ Error en initPushNotifications:', error);
    }
  }

  saveTokenToBackend(token: string) {

    this.http.post(`${this.apiUrl}`, { fcmToken: token })
    .subscribe({
      next: () => console.log('✅ Token FCM enviado al backend'),
      error: (err) => console.error('❌ Error al enviar token FCM', err)
    });

  }
}
