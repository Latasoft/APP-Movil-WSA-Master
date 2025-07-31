import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController, LoadingController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class ChangePasswordPage implements OnInit {
  token: string = '';
  password: string = '';
  confirmPassword: string = '';
  mensaje: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  async cambiarPassword() {
    this.mensaje = '';
    this.error = '';

    if (!this.password || !this.confirmPassword) {
      this.error = 'Debes completar ambos campos.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;

    try {
      const url = 'http://localhost:5000/api/auth/change-password';
      const body = {
        token: this.token,
        newPassword: this.password
      };

      await this.http.post(url, body).toPromise();

      this.mensaje = 'Contraseña actualizada correctamente. Ahora puedes iniciar sesión.';
      await this.mostrarToast('Contraseña actualizada ✅');

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);

    } catch (err: any) {
      console.error(err);
      this.error = err?.error?.message || 'Error al actualizar la contraseña.';
    } finally {
      this.loading = false;
    }
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    toast.present();
  }
}
