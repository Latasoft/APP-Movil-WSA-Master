import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonMenu, IonListHeader, IonContent, IonList, IonItem,IonLabel ,IonMenuToggle,IonIcon } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
interface MenuItem {
  title: string;
  url: string;
  icon?: string;
  roles: string[]; // Roles para los que se muestra este item.
}
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [IonMenu,IonContent, IonList, IonListHeader, IonItem
    ,IonMenuToggle
    ,CommonModule
    ,IonIcon
    ,IonLabel
    ,RouterLink
  ]
})
export class MenuComponent   {
  @Input() rolUsuario: string | null = null;
  @Output() roleCleared = new EventEmitter<void>();
  @Input() isAuthenticated: boolean = false; // Agregar esto

  constructor(private authService:AuthService,private router:Router) { }

  

  get isAdmin(): boolean {
    return this.rolUsuario === 'ADMINISTRADOR';
  }

  get isClient(): boolean {
    return this.rolUsuario === 'CLIENTE';
  }


  logout(): void {
    this.authService.logout().subscribe(() => {
      this.roleCleared.emit();
      this.router.navigate(['/login']);
    });
  }

}
