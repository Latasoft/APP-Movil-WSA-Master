import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonHeader, IonToolbar,IonLoading,IonBackButton,
  IonContent,IonItem,IonLabel,IonInput,IonButton,IonText,IonTitle,IonButtons
} from '@ionic/angular/standalone'
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  imports:[CommonModule,ReactiveFormsModule,
    IonHeader, IonToolbar,IonLoading,IonBackButton,
  IonContent,IonItem,IonLabel,IonInput,IonButton,IonText,IonTitle,IonButtons
  ]
})
export class ResetPasswordComponent  implements OnInit {

  form: FormGroup;
  mensaje = '';
  error = '';
  esperandoRespuesta = false;
  mostrandoEnvio = false;
  loading = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  ngOnInit(): void {
    
  }

  async solicitarReset() {
    if (this.form.invalid) return;

    this.mensaje = '';
    this.error = '';
    this.mostrandoEnvio = true;
    this.esperandoRespuesta = true;

    this.authService.resetPassword(this.form.value.email).subscribe({
      next: (res) => {
        this.mensaje = res.message;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Ocurrió un error';
        this.loading = false;
      }
    });
  }

}
