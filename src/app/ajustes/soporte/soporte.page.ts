import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonButton,IonIcon,
  IonButtons,IonBackButton
 } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.page.html',
  styleUrls: ['./soporte.page.scss'],
  standalone: true,
  imports: [RouterModule ,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonCard,IonCardHeader,IonCardTitle,
    IonCardContent,IonButton,IonIcon,IonButtons,IonBackButton]
})
export class SoportePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
