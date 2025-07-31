import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonImg,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCheckbox
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { ToastController,LoadingController } from '@ionic/angular/standalone';
import { Cliente } from 'src/app/models/cliente';
import { SearchableSelectComponent } from '../searchable-select/searchable-select.component';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  imports:[CommonModule,ReactiveFormsModule,
    IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonImg,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCheckbox,
  SearchableSelectComponent
  ]
})
export class PerfilComponent  implements OnInit {
  perfilForm!:FormGroup
  _id:string='';
  existFile: string = ''; // Ajustado a tipo string para URL de imagen
  selectedFile: File | null = null; // Ajustado a tipo File para manejar archivos
  @ViewChild('fileInput') fileInput!: ElementRef;
   // Variable para controlar si se muestra el selector de países
  cambiarNacionalidad: boolean = false;
  
  listaPaises: string[] = [
    'Chile', 'Argentina', 'Brasil', 'Uruguay', 'Perú', 'Bolivia', 'Paraguay',
    'Colombia', 'Venezuela', 'México', 'España', 'Estados Unidos', 'Canadá',
    'Francia', 'Italia', 'Alemania', 'Reino Unido', 'Australia', 'Nueva Zelanda',
    'Japón', 'China', 'India'
  ];
  constructor(private fb: FormBuilder,
    private authService:AuthService,
    private clienteService:ClienteService,
  private toastController:ToastController,
  private loadingController:LoadingController) { }

  private buildPerfilForm(){
    this.perfilForm= this.fb.group({
      pais_cliente:['',Validators.required],
      nombre_cliente:['',Validators.required],
      dato_contacto_cliente:['',Validators.required],
      foto_cliente:['']
    })

  }
   // Para cambiar entre mostrar input o selector de países
   toggleCambiarNacionalidad(event: any) {
    this.cambiarNacionalidad = event.detail.checked;
    
  }

  ngOnInit() {
    this.buildPerfilForm();
    this.loadUserDataProfile()
  }


  loadUserDataProfile(){
    this._id = this.loadUserId() ?? '';
    this.clienteService.getClienteById(this._id).subscribe({
      next: (response) => {
        if (response.clientes) {
          const cliente = response.clientes;
          this.existFile = cliente.foto_cliente;
          this.perfilForm.patchValue({
            pais_cliente: cliente.pais_cliente,
            nombre_cliente: cliente.nombre_cliente,
            dato_contacto_cliente: cliente.dato_contacto_cliente,
            foto_cliente: cliente.foto_cliente,
          });

          
        } 
      },
      error: (error) => {
        this.presentToast('Error al cargar datos del usuario','danger');
      }
    });
  }
  
  selectPhoto() {
    // Dispara el input file oculto
    this.fileInput.nativeElement.click();
  }
  

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Aquí puedes procesar el archivo, por ejemplo, mostrar una vista previa o subirlo.
      const reader = new FileReader();
      reader.onload = () => {
        this.existFile = reader.result as string;
        // Si deseas asignar el archivo al formulario:
        this.perfilForm.patchValue({ foto_cliente: this.existFile });
      };
      reader.readAsDataURL(file);
    }
  }


  loadUserId(){
    return this.authService.getIdFromToken();
  }


  async actualizarinfromacion() {
    if (this.perfilForm.invalid) {
      return;
    }
  
    // Construir el objeto cliente a partir del formulario
    const cliente: Cliente = {
      pais_cliente: this.perfilForm.get('pais_cliente')?.value,
      nombre_cliente: this.perfilForm.get('nombre_cliente')?.value,
      dato_contacto_cliente: this.perfilForm.get('dato_contacto_cliente')?.value,
      foto_cliente: this.existFile // o se asigna luego de subir la foto
    };
  
    // Crear y mostrar el loading
    const loading = await this.loadingController.create({
      message: 'Guardando información...',
      spinner: 'crescent'
    });
    await loading.present();
  
    // Determinar el archivo a enviar: si no hay seleccionado, se crea un File vacío
    const fileToUpload = this.selectedFile ? this.selectedFile : new File([], "");
  
    // Llamar al servicio para actualizar el cliente
    this.clienteService.updateClient(this._id, cliente, fileToUpload).subscribe({
      next: (response) => {
        loading.dismiss();
        this.presentToast('Cliente Actualizado','success');
        // Opcional: redirigir o refrescar la vista
      },
      error: (err) => {
        loading.dismiss();
        this.presentToast(err.message,'danger');
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

  onPaisSelected(pais: string) {
    this.perfilForm.get('pais_cliente')?.setValue(pais);
  }
  
  

}
