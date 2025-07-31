import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton,IonIcon,IonCol,IonRow,IonGrid,IonToolbar,IonFooter } from '@ionic/angular/standalone';
@Component({
  selector: 'app-paginacion',
  templateUrl: './paginacion.component.html',
  styleUrls: ['./paginacion.component.scss'],
  imports: [
    CommonModule,
    IonButton,IonIcon,IonCol,IonRow,IonGrid,IonToolbar,IonFooter
    
  ]
})


export class PaginacionComponent   {

  constructor (
  private router: Router,
) {}

    /** Número total de registros o elementos */
    @Input() total = 0;
    /** Página actual */
    @Input() page = 1;
    /** Número de elementos por página */
    @Input() limit = 10;
    /**
     * Evento que se emite cuando cambia la página.
     * Envía el nuevo número de página.
     */
    @Output() pageChange = new EventEmitter<number>();
  
    /** Calcula el total de páginas según `total` y `limit`. */
    get totalPages(): number {
      return Math.ceil(this.total / this.limit);
    }
    
  
    /** Ir a la página anterior (si existe). */
    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.pageChange.emit(this.page);
      }
    }
  
    /** Ir a la página siguiente (si existe). */
    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        this.pageChange.emit(this.page);
      }
    }
  
    /** Determina si el botón "Siguiente" debe estar deshabilitado. */
    get isNextDisabled(): boolean {
      return this.page >= this.totalPages;
    }
  
    /** Determina si el botón "Anterior" debe estar deshabilitado. */
    get isPrevDisabled(): boolean {
      return this.page <= 1;
    }

cerrarSesion() {
    console.log('Cerrar sesión...');
  }


   goTo(ruta: string) {
    this.router.navigate([ruta]);
  }
}
