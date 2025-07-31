import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { IonContent, 
  IonHeader,
   IonTitle,
    IonToolbar,
    IonButton,
    IonLabel,
    IonItem, 
  IonInput,
  IonIcon} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { loginResponse } from 'src/app/models/auth';
import { Router, RouterLink } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent,IonHeader, IonItem,IonTitle,IonLabel, IonToolbar, CommonModule, FormsModule,IonButton,IonInput,IonIcon,RouterLink]
})
export class LoginPage implements OnInit {

  @ViewChild('passwordInput') passwordInput: any;

  username: string = '';
  password: string = '';
  isLoggedIn: boolean = false;
  showPassword = false; // 👈 Agregamos esto en la clase


  constructor(
    private authService:AuthService,
    private router:Router,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  login() {
    if (!this.username || !this.password) {
      this.presentToast('Por favor, completa todos los campos.', 'warning');
      return;
    }
  
    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        if (response && response.token) {
          this.authService.setToken(response.token);
  
          this.authService.isAuthenticated().subscribe(isAuth => {
            if (isAuth) {
              this.presentToast('Inicio de sesión exitoso', 'success');
              this.router.navigate(['/']).then(() => {
                window.location.reload();
              });
            }
          });
        }
      },
      error: (err) => {
        const message = err?.error?.message || 'Error al iniciar sesión';
        this.presentToast(message, 'danger');
      }
    });
  }
  


  private async presentToast(message: string, color: 'primary' | 'success' | 'warning' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await toast.present();
  }
  
  togglePassword() {
    console.log('Toggle password clicked');
    console.log('Antes del toggle:', this.showPassword);
    this.showPassword = !this.showPassword;
    console.log('Después del toggle:', this.showPassword);
    
    // Cambiar el tipo del ion-input
    if (this.passwordInput) {
      this.passwordInput.type = this.showPassword ? 'text' : 'password';
      console.log('Tipo de input cambiado a:', this.passwordInput.type);
    } else {
      console.log('passwordInput no encontrado');
    }
    
    // Forzar la detección de cambios
    this.cdr.detectChanges();
  }

  togglePasswordVisibility() {
    this.togglePassword();
  }

}
