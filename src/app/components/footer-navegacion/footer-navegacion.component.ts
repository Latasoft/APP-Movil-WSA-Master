import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonFooter, IonToolbar, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-footer-navegacion',
  standalone: true,
  imports: [CommonModule, IonFooter, IonToolbar, IonGrid, IonRow, IonCol, IonIcon],
  templateUrl: './footer-navegacion.component.html',
  styleUrls: ['./footer-navegacion.component.scss']
})
export class FooterNavegacionComponent {
  @Input() activo: string = '';

  constructor(private router: Router) {}

  goTo(ruta: string) {
    this.router.navigate([ruta]);
  }

  cerrarSesion() {
    console.log('Cerrar sesión');
    // Aquí podrías llamar a AuthService.logout() si tienes uno
  }
}
