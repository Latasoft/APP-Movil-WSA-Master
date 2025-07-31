import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton
} from '@ionic/angular/standalone';

import { ToastController } from '@ionic/angular/standalone';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Router } from '@angular/router';
import { SearchableSelectComponent } from 'src/app/components/searchable-select/searchable-select.component';
import { SharedFooterComponent } from 'src/app/components/shared-footer/shared-footer.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchableSelectComponent,
    SharedFooterComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton
  ]
})
export class UsuariosPage implements OnInit {
  usuarioForm!: FormGroup;
  listaPaises: string[] = [
    'Chile', 'Argentina', 'Brasil', 'Uruguay', 'Perú', 'Bolivia', 'Paraguay',
    'Colombia', 'Venezuela', 'México', 'España', 'Estados Unidos', 'Canadá',
    'Francia', 'Italia', 'Alemania', 'Reino Unido', 'Australia', 'Nueva Zelanda',
    'Japón', 'China', 'India'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private usuarioService: UsuariosService,
    private router: Router
  ) {
    this.loadUserForm();
  }

  ngOnInit() {}

  private loadUserForm() {
    this.usuarioForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tipo_usuario: ['ADMINISTRADOR', Validators.required],
      pais_cliente: [''],
      nombre_cliente: [''],
      dato_contacto_cliente: [''],
      empresa_cliente: [''],
    });
  }

  onPaisSeleccionado(paisSeleccionado: string) {
    this.usuarioForm.patchValue({
      pais_cliente: paisSeleccionado || ''
    });
  }

  onSubmit() {
    try {
      if (this.usuarioForm.invalid) {
        this.presentToast('Formulario inválido. Por favor revisa los datos.', 'warning');
        return;
      }

      const formValue = this.usuarioForm.value;
      const { password, confirmarPassword, ...resto } = formValue;

      if (password !== confirmarPassword) {
        this.presentToast('Las contraseñas no coinciden.', 'danger');
        return;
      }

      // Validar que el usuario no esté vacío
      if (!formValue.username || formValue.username.trim() === '') {
        this.presentToast('El nombre de usuario es requerido.', 'warning');
        return;
      }

      // Validar que el email no esté vacío
      if (!formValue.email || formValue.email.trim() === '') {
        this.presentToast('El email es requerido.', 'warning');
        return;
      }

      const userData = { ...resto, password };

      // Registrar usuario directamente
      this.registrarUsuario(userData);
    } catch (error) {
      console.error('Error inesperado en onSubmit:', error);
      this.presentToast('Error inesperado. Intenta nuevamente.', 'danger');
    }
  }

  private registrarUsuario(userData: any) {
    console.log('Intentando registrar usuario:', userData);
    
    this.usuarioService.registarUsuario(userData).subscribe({
      next: (response) => {
        console.log('Usuario registrado exitosamente:', response);
        this.presentToast('Usuario registrado con éxito', 'success');
        this.usuarioForm.reset({
          username: '',
          email: '',
          password: '',
          confirmarPassword: '',
          tipo_usuario: 'ADMINISTRADOR',
          pais_cliente: '',
          nombre_cliente: '',
          dato_contacto_cliente: '',
          empresa_cliente: ''
        });
        this.router.navigate(['/lista-usuarios'], { queryParams: { refresh: true } });
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        let errorMessage = 'Error al registrar usuario';
        
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 409) {
          errorMessage = 'El usuario ya existe';
        } else if (error.status === 400) {
          errorMessage = 'Datos inválidos';
        } else if (error.status === 500) {
          errorMessage = 'Error del servidor';
        } else if (error.status === 0) {
          errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
        } else if (error.status === 404) {
          errorMessage = 'Servicio no encontrado';
        } else if (error.status === 401) {
          errorMessage = 'No autorizado';
        } else if (error.status === 403) {
          errorMessage = 'Acceso denegado';
        }
        
        this.presentToast(errorMessage, 'danger');
      },
    });
  }

  get isCliente() {
    return this.usuarioForm.get('tipo_usuario')?.value === 'CLIENTE';
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
}
