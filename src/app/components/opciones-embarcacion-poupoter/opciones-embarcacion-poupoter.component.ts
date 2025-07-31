import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonList, IonLabel, IonItem, IonIcon } from '@ionic/angular/standalone';
import { PopoverController } from '@ionic/angular/standalone';
import { IEmbarcacion } from 'src/app/models/embarcacion';

@Component({
  selector: 'app-opciones-embarcacion-poupoter',
  templateUrl: './opciones-embarcacion-poupoter.component.html',
  styleUrls: ['./opciones-embarcacion-poupoter.component.scss'],
  standalone: true,
  imports: [CommonModule, IonList, IonLabel, IonItem, IonIcon]
})
export class OpcionesEmbarcacionPoupoterComponent implements OnInit {

  @Input() embarc!: IEmbarcacion;
  

  constructor(private popoverController: PopoverController) {}

  ngOnInit(): void {}

  seleccionarAccion(action: string) {
    this.popoverController.dismiss({
      action,
      embarcacion: this.embarc
    });
  }
}
