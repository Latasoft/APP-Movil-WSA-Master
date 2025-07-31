import { Component, OnInit } from '@angular/core';


import { ListaEmbarcacionesBaseComponent } from '../lista-embarcaciones-base/lista-embarcaciones-base.component';
import {  IEmbarcacion } from 'src/app/models/embarcacion';
import { EmbarcacionesService } from 'src/app/services/embarcaciones.service';
import { AuthService } from 'src/app/services/auth.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSearchbar
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-lista-embarcaciones-cliente',
  templateUrl: './lista-embarcaciones-cliente.component.html',
  styleUrls: ['./lista-embarcaciones-cliente.component.scss'],
  imports: [ListaEmbarcacionesBaseComponent, FormsModule,
    IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSearchbar,
  ]
})
export class ListaEmbarcacionesClienteComponent implements OnInit {
  listaEmbarcaciones: IEmbarcacion[] = [];
   // Lista que realmente se muestra (después de filtrar)
   listaEmbarcacionesFiltradas: IEmbarcacion[] = [];
  _id: string = ''
  total = 0;     // total de registros
  page = 1;      // página actual
  limit = 10;    // registros por página
    // Término de búsqueda
    searchTerm: string = '';
  constructor(private embarcacionesService: EmbarcacionesService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadMisEmbarcaciones();

  }

  loadMisEmbarcaciones() {
    this.loadId();

    this.embarcacionesService.getEmbarcacioneByClienteId(this._id, this.page, this.limit).subscribe(
      (response: any) => {
        this.listaEmbarcaciones = response.data
        // Asegúrate de asignar las propiedades de la paginación:
        this.page = response.pagination.page;        // 1
        this.limit = response.pagination.limit;      // 10
        this.total = response.pagination.total;      // 1


        // Inicialmente, la lista filtrada es la misma que la original
        this.listaEmbarcacionesFiltradas = [...this.listaEmbarcaciones];
      }
    )
  }

  loadId() {
    this._id = this.authService.getIdFromToken() ?? '';
  }

    // Este método se llama cada vez que cambia la barra de búsqueda
    filterEmbarcaciones(event: any) {
      const term = event.detail.value?.toLowerCase() || '';
      
      if (term.trim() === '') {
        // Si no hay búsqueda, muestra la lista completa
        this.listaEmbarcacionesFiltradas = [...this.listaEmbarcaciones];
      } else {
        // Filtra por título o destino
        this.listaEmbarcacionesFiltradas = this.listaEmbarcaciones.filter(emb => {
          const titulo = emb.titulo_embarcacion?.toLowerCase() || '';
          const destino = emb.destino_embarcacion?.toLowerCase() || '';
          return (
            titulo.includes(term) || 
            destino.includes(term)
          );
        });
      }
    }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadMisEmbarcaciones(); // recargar
  }

}
