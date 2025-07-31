import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ToastController} from'@ionic/angular/standalone'
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonToggle,
  IonButton
} from '@ionic/angular/standalone';
import { FilterSelectComponent } from 'src/app/components/filter-select/filter-select.component';
import { Usuario } from 'src/app/models/usuario';
import { GrupoService } from 'src/app/services/grupo.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.scss'],
  imports:[ReactiveFormsModule,CommonModule,FilterSelectComponent,
    IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonToggle,
  IonButton
  ]
})
export class GrupoComponent  implements OnInit {

  grupoForm!: FormGroup;
  TRABAJADORes:Usuario[]=[];
  isEditMode:boolean=false;
  _id:string | null=null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private grupoService: GrupoService,
    private toastController: ToastController,
    private userService:UsuariosService,
    private route:ActivatedRoute,
    private router:Router
  ) {
    this.buildForm();
  }

  private buildForm(){
    this.grupoForm=this.fb.group({
      name: ['', Validators.required],
      status: [true, Validators.required],
      members: [[]]
    })
  }


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('_id'); // asegúrate de que el parámetro se llame 'id'
      this.isEditMode = !!id;   
  
      this.getAllTRABAJADORes();
      
      if (this.isEditMode && id) {
        this._id = id;
        this.cargarGrupo(id);
      }
    });
  }

  cargarGrupo(_id:string){

    this.grupoService.getGroupById(_id).subscribe(response=>{
      
      this.grupoForm.patchValue(
        {
          name:response.data.name,
          status:response.data.status,
          members:response.data.members
        }

      )


    })

  }
  getAllTRABAJADORes(){
    this.userService.getAllTRABAJADOResPaginados().subscribe(
      (response)=>{
        this.TRABAJADORes=response.TRABAJADORes
      }
    )
  }

  onSubmit(){
    if(this.grupoForm.invalid){
      this.presentToast("Faltan Campos","warning")
      return
    }

    const formData= { ...this.grupoForm.value}

    const data={
      name:formData.name,
      status:formData.status,
      members:formData.members
    }

    if (this.isEditMode && this._id) {
      this.updateGrupo(data);
    } else {
      this.createGrupo(data);
    }

  }

  private createGrupo(data: any) {
    this.grupoService.crearGrupo(data).subscribe({
      next: async () => {
        this.isSubmitting = false;
        await this.presentToast('¡Grupo creado con éxito!','success');
        this.router.navigate(['/lista-grupos'], { queryParams: { refresh: true } });
        this.resetForm();
        
      },
      error: async (err) => {
        this.isSubmitting = false;
        await this.presentToast('Error al crear grupo','danger');
      }
    });
  }
  
  // ✅ Método para actualizar una embarcación
  private updateGrupo(data: any) {
    this.grupoService.updateGrupo(this._id!, data).subscribe({
      next: async () => {
        this.isSubmitting = false;
        await this.presentToast('Grupo actualizado con éxito!','success');
        this.router.navigate(['/lista-grupos'], { queryParams: { refresh: true } });
      },
      error: async (err) => {
        this.isSubmitting = false;
        
        await this.presentToast('Error al actualizar grupo','danger');
      }
    });
  }
  private resetForm() {
    this.grupoForm.reset({
      name: '',
      status: true,
      members: [],
    
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

}
