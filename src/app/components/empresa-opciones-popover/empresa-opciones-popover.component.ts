import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-empresa-opciones-popover',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './empresa-opciones-popover.component.html',
  styleUrls: ['./empresa-opciones-popover.component.scss']
})
export class EmpresaOpcionesPopoverComponent {
  @Input() empresa: any;

  constructor(private popoverCtrl: PopoverController) {}

  cerrar(accion: string) {
    this.popoverCtrl.dismiss({ accion, empresa: this.empresa });
  }
}
