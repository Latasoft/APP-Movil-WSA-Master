import { Component, OnInit } from '@angular/core';
import {  GetGroupsForAdminResponse, GetUserGroupsResponse, GrupoAdmin, GrupoBasico } from 'src/app/models/grupo';
import { AuthService } from 'src/app/services/auth.service';
import { GrupoService } from 'src/app/services/grupo.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge
} from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
@Component({
  selector: 'app-lista-grupos',
  templateUrl: './lista-grupos.component.html',
  styleUrls: ['./lista-grupos.component.scss'],
  imports:[ReactiveFormsModule,CommonModule,
    IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge
  ]
})
export class ListaGruposComponent  implements OnInit {
  rolUsuario:string='';
  _id=''
  currentPage = 1;
  totalPages  = 1;
  gruposAdmin:GrupoAdmin[]=[]
  gruposTRABAJADOR:GrupoBasico[]=[];
  constructor(private authService:AuthService,private grupoService:GrupoService,
    private router:Router,private toastController:ToastController,private route:ActivatedRoute) {
    }

  ngOnInit() {
    // cada vez que cambian los queryParams (incluyendo refresh) recarga
    this.route.queryParams.subscribe(params => {
      // si vienes con ?refresh=true o la primera vez, llama a load
      this.loadGroups(this.currentPage);
    });
  }

  private loadGroups(page: number) {
    this.rolUsuario = this.authService.getRoleFromToken() ?? '';
    this._id     = this.authService.getIdFromToken()   ?? '';

    if (this.rolUsuario === 'ADMINISTRADOR') {
      this.grupoService.getAllGroupsForAdmin(page).subscribe({
        next: (res: GetGroupsForAdminResponse) => {
          this.gruposAdmin = res.data;
          this.totalPages  = res.totalPages;
          this.currentPage = res.currentPage;
        },
        error: () => console.error('Error cargando grupos admin')
      });
    } else {
      this.grupoService.getAllGroupsForEmployee(this._id, page).subscribe({
        next: (res: GetUserGroupsResponse) => {
          this.gruposTRABAJADOR = res.data;
          this.totalPages       = res.totalPages;
          this.currentPage      = res.currentPage;
        },
        error: () => console.error('Error cargando grupos TRABAJADOR')
      });
    }
  }


  getRol(){
    this.rolUsuario=this.authService.getRoleFromToken()??'';
  }

  loadId(){
    this._id=this.authService.getIdFromToken()??'';
  }

  getAllGroupsForAdmin() {
    this.grupoService.getAllGroupsForAdmin().subscribe({
      next: (res) => {
        this.gruposAdmin = res.data;
        
        this.totalPages = res.totalPages;
      },
      error: (err) => {
        this.presentToast('Error al obtener grupos para admin','danger');
      }
    });
  }

  getAllGroupsForEmployee() {
    this.loadId();
    this.grupoService.getAllGroupsForEmployee(this._id).subscribe({
      next: (res) => {
        this.gruposTRABAJADOR = res.data;
        this.totalPages = res.totalPages;
      },
      error: (err) => {
        this.presentToast('Error al obtener grupos del TRABAJADOR','danger');
      }
    });
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPages) return;

    this.currentPage = pagina;

    if (this.rolUsuario === 'ADMINISTRADOR') {
      this.getAllGroupsForAdmin();
    } else {
      this.getAllGroupsForEmployee();
    }
  }

  verChat(id: string) {
    this.router.navigate(['/chat', id]); // Ajusta ruta según tu app
  }
  
  irAlChat(id: string) {
    this.router.navigate(['/chat', id]); // Ajusta ruta del chat
  }
  editarGrupo(_id: string) {
    this.router.navigate(['/grupo', _id]); // Ajusta esta ruta según tu configuración
  }
  obtenerNombresVisibles(members: { username: string }[]): string {
    if (!members || members.length === 0) return 'Sin miembros';
    const visibles = members.slice(0, 3).map(m => m.username);
    return visibles.join(', ') + (members.length > 3 ? '...' : '');
  }
  crearNuevoGrupo() {
    this.router.navigate(['/grupo']); // Ajusta según tus rutas
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
