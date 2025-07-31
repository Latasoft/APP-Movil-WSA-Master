import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { EmpresaService } from 'src/app/services/empresa.service';
import { Input } from '@angular/core';


@Component({
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.page.html',
  styleUrls: ['./modal-cliente.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})


export class ModalClientePage {


  @Input() empresaParaEditar?: any;


  cliente = {
    nombre_empresa: '',
    pais: '',
    direccion: '',
    telefono: '',
    correo: '',

    contacto_operativo: {
      nombre: '',
      cargo: '',
      correo: '',
      telefono: ''
    },

    contacto_da: {
      nombre: '',
      cargo: '',
      correo: '',
      telefono: ''
    }
  };

  constructor(
    private modalCtrl: ModalController,
    private empresaService: EmpresaService
  ) {}

  ngOnInit() {
  if (this.empresaParaEditar) {
    this.cliente = JSON.parse(JSON.stringify(this.empresaParaEditar));
  }
}

  guardar() {
  const req = this.empresaParaEditar
    ? this.empresaService.actualizarEmpresa(this.empresaParaEditar._id, this.cliente)
    : this.empresaService.crearEmpresa(this.cliente);

  req.subscribe({
    next: (res) => {
      this.modalCtrl.dismiss(res);
    },
    error: (err) => {
      console.error('Error al guardar empresa:', err);
    }
  });
}



  cerrar() {
    this.modalCtrl.dismiss();
  }
}
