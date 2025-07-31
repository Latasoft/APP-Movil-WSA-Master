import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {IonList,IonLabel,IonItem} from '@ionic/angular/standalone'
import { Usuario } from 'src/app/models/usuario';
import { PopoverController } from '@ionic/angular/standalone';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-opciones-usuario-poupoter',
  templateUrl: './opciones-usuario-poupoter.component.html',
  styleUrls: ['./opciones-usuario-poupoter.component.scss'],
  imports:[IonList,IonLabel,IonItem,CommonModule]
})
export class OpcionesUsuarioPoupoterComponent  implements OnInit {

  @Input() user!: Usuario;

  constructor(
    private popoverController: PopoverController,
    private usuariosService: UsuariosService,
    private toastController: ToastController
  ) {}
  ngOnInit(): void {
    
  }

  selectOption(action: string) {
    this.popoverController.dismiss({ action });
  }

  toggleCrearNave(){

    const nuevoEstado = !this.user.puede_crear_nave;

    this.usuariosService.actualizarCampo(this.user._id!,{
      puede_crear_nave: nuevoEstado
    }).subscribe({
      next: async () =>{
        this.user.puede_crear_nave = nuevoEstado;
        const mensaje = nuevoEstado
          ? '✅ Crear Nave habilitado para el usuario'
          : '❌ Crear Nave deshabilitado para el usuario';

        const toast = await this.toastController.create({
          message: mensaje,
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.popoverController.dismiss();

      },
      error: async () => {
        const toast = await this.toastController.create({
          message: 'Error al actualizar el permiso',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

}
