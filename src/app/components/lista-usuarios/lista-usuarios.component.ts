import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  IonSearchbar,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  AlertController,
  ToastController,
  IonSelect,
  IonSelectOption,
  IonChip,
  IonCard,
  IonCardContent,
  IonBadge,
  IonSpinner,
  IonText,
  IonAvatar,
  IonPopover,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonAlert,
  IonToast,
  IonFooter
} from '@ionic/angular/standalone';
import { PopoverController } from '@ionic/angular/standalone';
import { PaginatedUsersResponse, Usuario } from 'src/app/models/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { FormsModule } from '@angular/forms';
import { OpcionesUsuarioPoupoterComponent } from '../opciones-usuario-poupoter/opciones-usuario-poupoter.component';
import { AuthService } from 'src/app/services/auth.service';
import { SharedFooterComponent } from '../shared-footer/shared-footer.component';
import { PaginacionComponent } from '../paginacion/paginacion.component';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss'],
  imports:[
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonChip,
    IonIcon,
    IonLabel,
    IonCard,
    IonCardContent,
    IonButton,
    IonButtons,
    IonBackButton,
    IonItem,
    IonList,
    IonBadge,
    IonSpinner,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonAvatar,
    IonPopover,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonAlert,
    IonToast,
    IonFooter,
    SharedFooterComponent,
    PaginacionComponent
  ]
})
export class ListaUsuariosComponent  implements OnInit {
  tipo_usuario:string=''
  users: Usuario[] = [];
  filteredUsers: Usuario[] = [];
  allUsers: Usuario[] = [];
  currentPage = 1;
  totalPages = 1;
  totalUsers = 0;
  limit = 10; // Tamaño de página
  searchTerm: string = '';
  roles: string[] = ['ADMINISTRADOR', 'CLIENTE', 'TRABAJADOR','ASISTENTE','ADMINISTRATIVO'];
  selectedRole: string = 'ADMINISTRADOR';
  currentUser: any = null;
  lastUpdate: string = '';
  loading = false;

  constructor(
    private usuariosService: UsuariosService,
    private router:Router,
    private route:ActivatedRoute,
    private popoverController: PopoverController,
    private alertController: AlertController,
    private toastController:ToastController,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('=== INICIALIZANDO COMPONENTE ===');
    
    // Cargar todos los usuarios primero para los contadores
    this.loadAllUsersForCounters();
    
    // Luego cargar usuarios del rol por defecto
    this.loadUsers(1, this.selectedRole);
  }

  // Método para cargar información del usuario actual
  loadCurrentUser() {
    const decodedToken = this.authService.getDecodedToken();
    if (decodedToken) {
      this.currentUser = {
        username: decodedToken.sub || 'Usuario',
        tipo_usuario: decodedToken.role || 'Usuario',
        _id: decodedToken._id || ''
      };
    }
  }

  // Método para actualizar la última actualización
  updateLastUpdate() {
    const now = new Date();
    this.lastUpdate = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  // Métodos para calcular contadores reales
  getTotalCount(): number {
    return this.allUsers.length;
  }

  getAdminCount(): number {
    return this.allUsers.filter(user => user.tipo_usuario === 'ADMINISTRADOR').length;
  }

  getClientCount(): number {
    return this.allUsers.filter(user => user.tipo_usuario === 'CLIENTE').length;
  }

  getWorkerCount(): number {
    return this.allUsers.filter(user => user.tipo_usuario === 'TRABAJADOR').length;
  }

  getAssistantCount(): number {
    return this.allUsers.filter(user => user.tipo_usuario === 'ASISTENTE').length;
  }

  getAdministrativeCount(): number {
    return this.allUsers.filter(user => user.tipo_usuario === 'ADMINISTRATIVO').length;
  }

  // Método mejorado para filtros rápidos
  filterByQuickRole(role: string) {
    console.log('=== FILTRANDO POR ROL ===');
    console.log('Rol seleccionado:', role);
    
    this.selectedRole = role;
    this.currentPage = 1;
    
    if (role === '') {
      // Si es "Todos", cargar todos los usuarios
      this.loadAllUsers();
    } else {
      // Si es un rol específico, usar el método normal
      this.loadUsers(this.currentPage, role);
    }
    
    // Actualizar contadores después del filtrado
    setTimeout(() => {
      this.updateCounters();
    }, 100);
  }

  // Método para refrescar datos
  refreshData() {
    this.updateLastUpdate();
    this.loadUsers(this.currentPage, this.selectedRole);
    this.presentToast('Datos actualizados', 'success');
  }

  // Método original que funcionaba
  loadUsers(page: number, rol: string = this.selectedRole) {
    console.log('=== CARGANDO USUARIOS ===');
    console.log('Página:', page);
    console.log('Rol:', rol);
    console.log('Límite:', this.limit);
    console.log('URL del servicio:', `${this.usuariosService['apiUrl']}?role=${rol}&page=${page}&limit=${this.limit}`);
    
    this.loading = true;
    this.usuariosService.getUsersByRole(page, this.limit, rol).subscribe({
      next: (res: PaginatedUsersResponse) => {
        console.log('=== RESPUESTA EXITOSA ===');
        console.log('Usuarios recibidos:', res.users);
        console.log('Total de usuarios:', res.totalUsers);
        console.log('Página actual:', res.currentPage);
        console.log('Total de páginas:', res.totalPages);
        
        this.users = res.users;
        this.totalUsers = res.totalUsers;
        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;
        this.filteredUsers = this.users;
        
        // Si no tenemos todos los usuarios cargados, cargarlos para los contadores
        if (this.allUsers.length === 0) {
          this.loadAllUsersForCounters();
        }
        
        // Actualizar contadores en tiempo real
        this.updateCounters();
        
        console.log('=== CONTADORES ACTUALIZADOS ===');
        console.log('Total:', this.getTotalCount());
        console.log('Administradores:', this.getAdminCount());
        console.log('Clientes:', this.getClientCount());
        console.log('Trabajadores:', this.getWorkerCount());
        console.log('Asistentes:', this.getAssistantCount());
        console.log('Administrativos:', this.getAdministrativeCount());
        
        this.loading = false;
      },
      error: (err) => {
        console.log('=== ERROR AL CARGAR USUARIOS ===');
        console.error(err);
        this.loading = false;
        this.users = [];
        this.filteredUsers = [];
        this.updateCounters();
      }
    });
  }

  // Método para cargar todos los usuarios
  loadAllUsers() {
    console.log('=== CARGANDO TODOS LOS USUARIOS ===');
    this.loading = true;
    
    this.usuariosService.getAllUsers().subscribe({
      next: (users: any[]) => {
        console.log('=== TODOS LOS USUARIOS CARGADOS ===');
        console.log('Total de usuarios:', users.length);
        
        this.allUsers = users; // Actualizar todos los usuarios
        this.users = users;
        this.filteredUsers = users;
        this.totalUsers = users.length;
        this.currentPage = 1;
        this.totalPages = 1;
        
        // Actualizar contadores
        this.updateCounters();
        
        console.log('=== CONTADORES ACTUALIZADOS ===');
        console.log('Total:', this.getTotalCount());
        console.log('Administradores:', this.getAdminCount());
        console.log('Clientes:', this.getClientCount());
        console.log('Trabajadores:', this.getWorkerCount());
        console.log('Asistentes:', this.getAssistantCount());
        console.log('Administrativos:', this.getAdministrativeCount());
        
        this.loading = false;
      },
      error: (err) => {
        console.log('=== ERROR AL CARGAR TODOS LOS USUARIOS ===');
        console.error(err);
        this.loading = false;
        this.allUsers = [];
        this.users = [];
        this.filteredUsers = [];
        this.updateCounters();
      }
    });
  }

  // Método para cargar todos los usuarios solo para contadores
  loadAllUsersForCounters() {
    console.log('=== CARGANDO TODOS LOS USUARIOS PARA CONTADORES ===');
    
    this.usuariosService.getAllUsers().subscribe({
      next: (users: any[]) => {
        console.log('=== USUARIOS PARA CONTADORES CARGADOS ===');
        console.log('Total de usuarios para contadores:', users.length);
        
        this.allUsers = users; // Solo actualizar allUsers para contadores
        
        console.log('=== CONTADORES ACTUALIZADOS ===');
        console.log('Total:', this.getTotalCount());
        console.log('Administradores:', this.getAdminCount());
        console.log('Clientes:', this.getClientCount());
        console.log('Trabajadores:', this.getWorkerCount());
        console.log('Asistentes:', this.getAssistantCount());
        console.log('Administrativos:', this.getAdministrativeCount());
        
        this.updateCounters();
      },
      error: (err) => {
        console.log('=== ERROR AL CARGAR USUARIOS PARA CONTADORES ===');
        console.error(err);
        this.allUsers = [];
        this.updateCounters();
      }
    });
  }

  updateFilteredUsers() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredUsers = term
      ? this.users.filter(user => 
          user.username.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.tipo_usuario.toLowerCase().includes(term)
        )
      : this.users;
  }

  goToEmbarcaciones(){
    this.router.navigate(['/lista-embarcaciones'])
  }
  filterUsers(term: string | null | undefined) {
    console.log('=== FILTRANDO USUARIOS ===');
    console.log('Término de búsqueda:', term);
    
    if (!term || term.trim() === '') {
      this.filteredUsers = this.users;
    } else {
      const searchTerm = term.toLowerCase().trim();
      this.filteredUsers = this.users.filter(user => 
        user.username.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.tipo_usuario.toLowerCase().includes(searchTerm)
      );
    }
    
    console.log('Usuarios filtrados:', this.filteredUsers.length);
    
    // Actualizar contadores después del filtrado
    this.updateCounters();
  }

  goToPage(page: number) {
    // Método deshabilitado ya que no usamos paginación
    return;
  }
  async openOptions(user: Usuario) {
    const popover = await this.popoverController.create({
      component: OpcionesUsuarioPoupoterComponent,
      componentProps: { user },
      translucent: true,
      showBackdrop: true
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();

    if (data?.action === 'edit') {
      this.viewUser(user._id);
    } else if (data?.action === 'delete') {
      this.confirmDeleteUser(user._id);
    }
  }
  async confirmDeleteUser(_id: string | undefined) {
    if (!_id) return;

    const alert = await this.alertController.create({
      header: '¿Eliminar usuario?',
      message: 'Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.deleteUser(_id);
          }
        }
      ]
    });

    await alert.present();
  }

  filterByRole(event: any) {
    const selected = event.detail.value;
    this.selectedRole = selected;
    this.loadUsers(1, selected); // Siempre reinicia desde página 1
  }
  private async presentToast(message: string, color: 'primary' | 'success' | 'warning' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await toast.present();
  }
  async deleteUser(_id: string | undefined) {
    if (!_id) return;

    this.usuariosService.deleteUser(_id).subscribe({
      next: async() => {
        await this.presentToast('Usuario eliminado con éxito','success')
        this.loadUsers(this.currentPage, this.selectedRole); // Usar método original
      },
      error: (err: any) => {
        console.error('Error al eliminar usuario:', err);
        this.presentToast('Error al eliminar usuario','danger')
      }
    });
  }


  viewUser(_id:string | undefined){
    if (!_id) return;

    this.router.navigate(['/usuarios'],{queryParams:{_id:_id}})
  }

  // Método para optimizar el rendimiento de la lista
  trackByUserId(index: number, user: Usuario): string {
    return user._id || index.toString();
  }

  // Método para manejar el click del botón flotante
  nuevoUsuario() {
    console.log('Nuevo usuario clicked');
    // Aquí puedes agregar la lógica para crear un nuevo usuario
    // Por ejemplo, navegar a una página de creación de usuario
    this.router.navigate(['/usuarios']);
  }

  updateCounters() {
    // Forzar la detección de cambios para actualizar los contadores en la vista
    this.cdr.detectChanges();
  }

  // Método para manejar cambios de página
  onPageChange(page: number) {
    console.log('=== CAMBIO DE PÁGINA ===');
    console.log('Nueva página:', page);
    
    this.currentPage = page;
    this.loadUsers(page, this.selectedRole);
  }

}
