import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ModalClientePage } from 'src/app/modals/modal-cliente/modal-cliente.page';
import { EmpresaService } from 'src/app/services/empresa.service';
import { PopoverController } from '@ionic/angular';
import { EmpresaOpcionesPopoverComponent } from 'src/app/components/empresa-opciones-popover/empresa-opciones-popover.component';
import { DetalleClientePage } from 'src/app/modals/detalle-cliente/detalle-cliente.page';



@Component({
  selector: 'app-gestionar-clientes',
  templateUrl: './gestionar-clientes.page.html',
  styleUrls: ['./gestionar-clientes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule 
  ]
})
export class GestionarClientesPage implements OnInit {
  clientes: any[] = [];
  clientesFiltrados: any[] = [];

  busqueda: string = '';
  filtroPais: string = '';
  paises: string[] = [];

  constructor(
    private modalCtrl: ModalController,
    private empresaService: EmpresaService,
    private popoverCtrl: PopoverController,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.obtenerClientes();
  }

  obtenerClientes() {
  this.empresaService.obtenerEmpresas().subscribe({
    next: (res) => {
      this.clientes = res;
      this.actualizarPaises();
      this.filtrarClientes();
    },
    error: (err) => {
      console.error('Error al cargar empresas:', err);
    }
  });
}

  actualizarPaises() {
    const paisSet = new Set(this.clientes.map(c => c.pais));
    this.paises = Array.from(paisSet);
  }

  filtrarClientes() {
    this.clientesFiltrados = this.clientes.filter(c => {
      const coincideNombre = c.nombre_empresa.toLowerCase().includes(this.busqueda.toLowerCase());
      const coincidePais = this.filtroPais ? c.pais === this.filtroPais : true;
      return coincideNombre && coincidePais;
    });
  }

  async abrirModalCliente() {
  const modal = await this.modalCtrl.create({
    component: ModalClientePage
  });

  await modal.present();

  const { data } = await modal.onWillDismiss();

  if (data) {
    
    this.clientes.unshift(data); 
    this.actualizarPaises();
    this.filtrarClientes();
  }
}

  async mostrarOpciones(event: any, cliente: any) {
  const popover = await this.popoverCtrl.create({
    component: EmpresaOpcionesPopoverComponent,
    event,
    translucent: true,
    componentProps: { empresa: cliente }
  });

  await popover.present();

  const { data } = await popover.onDidDismiss();

  if (data) {
    const accion = data.accion;

    switch (accion) {
      case 'ver':
      const verModal = await this.modalCtrl.create({
        component: DetalleClientePage,
        componentProps: {
          empresa: data.empresa
        }
      });
      await verModal.present();
      break;

      case 'editar':
        const editarModal = await this.modalCtrl.create({
          component: ModalClientePage,
          componentProps: {
            empresaParaEditar: data.empresa
          }
        });

        await editarModal.present();

        const { data: editada } = await editarModal.onWillDismiss();

        if (editada) {
          // Reemplazar empresa editada en la lista
          const index = this.clientes.findIndex(e => e._id === editada._id);
          if (index > -1) {
            this.clientes[index] = editada;
            this.filtrarClientes();
          }
        }
        break;

      case 'eliminar':
        this.eliminarEmpresa(data.empresa);
        break;
    }
  }
}
eliminarEmpresa(empresa: any) {
  if (!confirm(`¿Estás seguro de eliminar la empresa "${empresa.nombre_empresa}"?`)) return;

  this.empresaService.eliminarEmpresa(empresa._id).subscribe({
    next: () => {
      this.clientes = this.clientes.filter(e => e._id !== empresa._id);
      this.actualizarPaises();
      this.filtrarClientes();
      console.log('Empresa eliminada correctamente');
    },
    error: (err) => {
      console.error('Error al eliminar empresa:', err);
    }
  });
}


  
}
