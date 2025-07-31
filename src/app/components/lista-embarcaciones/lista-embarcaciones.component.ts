import { Component, OnInit } from '@angular/core';
import { IEmbarcacion } from 'src/app/models/embarcacion';
import { AuthService } from 'src/app/services/auth.service';
import { EmbarcacionesService } from 'src/app/services/embarcaciones.service';
import { ListaEmbarcacionesBaseComponent } from '../lista-embarcaciones-base/lista-embarcaciones-base.component';
import { FooterNavegacionComponent } from '../footer-navegacion/footer-navegacion.component';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonSearchbar,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-lista-embarcaciones',
  templateUrl: './lista-embarcaciones.component.html',
  styleUrls: ['./lista-embarcaciones.component.scss'],
  imports:[ListaEmbarcacionesBaseComponent, FooterNavegacionComponent, FormsModule,RouterLink,
    IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonSearchbar,
  IonButton,
  IonIcon,
  CommonModule
  ]
})


export class ListaEmbarcacionesComponent  implements OnInit {

  puede_crear_nave: boolean = false;
  paginaANavegar=''
  rolUsuario:string=''
  _id:string=''
    // Paginación
    page = 1;
    limit = 1000;   // Mostrar hasta 1000 embarcaciones (sin límite práctico)
    total = 0;

  // Datos de la lista
  listaEmbarcaciones: IEmbarcacion[] = [];

  // Lista filtrada (lo que realmente mostramos)
  listaEmbarcacionesFiltradas: IEmbarcacion[] = [];

  // Texto de búsqueda
  searchTerm = '';
  constructor(private authService:AuthService,private embarcacionService:EmbarcacionesService, private router: Router) { }

  ngOnInit() {
  this.getRolYPermisos();
  this.loadEmbarcaciones();
}


  loadEmbarcaciones() {
    if (this.rolUsuario === 'TRABAJADOR') {
      this.paginaANavegar='/embarcaciones'
      this.loadEmbarcacionesTRABAJADOR();
    } else if (this.rolUsuario === 'ADMINISTRADOR') {
      this.paginaANavegar='/embarcaciones'
      this.loadEmbarcacionesAdmin();
    }
    // agrego al cliente 
    else if (this.rolUsuario === 'CLIENTE') {
  this.paginaANavegar = '/embarcaciones';
  this.loadEmbarcacionesCliente();
}

  }
  loadEmbarcacionesCliente() {
  this.loadId();
  this.embarcacionService
    .getEmbarcacioneByClienteId(this._id, this.page, this.limit)
    .subscribe((res: any) => {
      console.log('🛳️ Embarcaciones CLIENTE:', res);
      this.listaEmbarcaciones = res.data;
      this.total = res.pagination.total;
      this.page = res.pagination.page;
      this.limit = res.pagination.limit;
      this.updateFilteredList();
    });
}



  



 getRolYPermisos() {
  const tokenData = this.authService.getDecodedToken();
  console.log('🧾 Token decodificado:', tokenData);
  this.rolUsuario = tokenData?.role ?? '';
  this.puede_crear_nave = tokenData?.puede_crear_nave ?? false;
  console.log('🎭 Rol del usuario:', this.rolUsuario);
  console.log('⚓ Permiso crear nave:', this.puede_crear_nave);
}




  loadId(){
    this._id=this.authService.getIdFromToken()??'';
  }

   /** Lógica si el rol es TRABAJADOR */
   loadEmbarcacionesTRABAJADOR() {
    this.loadId();
    this.embarcacionService
      .getEmbarcacionesByTRABAJADORId(this._id, this.page, this.limit)
      .subscribe((res: any) => {
        console.log('🛳️ Embarcaciones ADMIN:', res);
        this.listaEmbarcaciones = res.data;
        this.total = res.pagination.total;
        this.page = res.pagination.page;
        this.limit = res.pagination.limit;
        // Actualiza la lista filtrada
        this.updateFilteredList();
      });
  }

  /** Lógica si el rol es ADMINISTRADOR */
  loadEmbarcacionesAdmin() {
    this.embarcacionService
      .getEmbarcacionesAdmin(this.page, this.limit)
      .subscribe((res: any) => {
        console.log('🛳️ Embarcaciones ADMIN:', res);
        this.listaEmbarcaciones = res.data;
        this.total = res.pagination.total;
        this.page = res.pagination.page;
        this.limit = res.pagination.limit;
        // Actualiza la lista filtrada
        this.updateFilteredList();
      });
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    // Volvemos a cargar la data con la nueva página
    this.loadEmbarcaciones();
  }

  filterEmbarcaciones(event: any) {
    this.searchTerm = event.detail.value?.toLowerCase() || '';
    this.updateFilteredList();
  }

  // Aplica el filtro sobre la lista original 
  // (buscando en 'titulo_embarcacion' o 'destino_embarcacion')
  updateFilteredList() {
    const term = this.searchTerm.trim();
    if (!term) {
      // si no hay texto de búsqueda, muestra todo
      this.listaEmbarcacionesFiltradas = [...this.listaEmbarcaciones];
      return;
    }

    this.listaEmbarcacionesFiltradas = this.listaEmbarcaciones.filter(emb => {
      const titulo = emb.titulo_embarcacion?.toLowerCase() || '';
      const destino = emb.destino_embarcacion?.toLowerCase() || '';
      return titulo.includes(term) || destino.includes(term);
    });
  }
  handleEmbarcacionDeleted(embarcacionId: string) {
    // Recarga los datos desde el servidor
    this.loadEmbarcaciones();
    
   
  }

  logout() {
    if (this.authService && typeof this.authService.logout === 'function') {
      this.authService.logout();
    } else {
      localStorage.clear();
    }
    this.router.navigate(['/login']);
  }

}
