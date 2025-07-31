import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators, FormArray, FormControl, FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonToggle,
  IonSelect,
  IonSelectOption,
  IonSearchbar,
  IonCheckbox,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonIcon,
  IonCardTitle,
  IonFooter
} from '@ionic/angular/standalone';

import { UsuariosService } from 'src/app/services/usuarios.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/models/cliente';
import { Usuario } from 'src/app/models/usuario';
import { EmbarcacionesService } from 'src/app/services/embarcaciones.service'; // Servicio que interactúa con tu backend
import { EmpresaService } from 'src/app/services/empresa.service';
import { ToastController } from '@ionic/angular/standalone';
import { FilterSelectComponent } from 'src/app/components/filter-select/filter-select.component';
import { ActivatedRoute } from '@angular/router';
import { IAccion, IEstado, IServicio } from 'src/app/models/embarcacion';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { AccionModalComponent } from 'src/app/components/accion-modal/accion-modal.component';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-embarcaciones',
  templateUrl: './embarcaciones.page.html',
  styleUrls: ['./embarcaciones.page.scss'],
  standalone: true,
  imports: [ CommonModule,FormsModule, ReactiveFormsModule,FilterSelectComponent,
    IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonToggle,
  IonSelect,
  IonSelectOption,
  IonSearchbar,
  IonCheckbox,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonIcon,
  IonCardTitle,
  IonFooter
  ],
  providers: [
    ModalController
  ]
})
export class EmbarcacionesPage implements OnInit {
  clientes:Cliente[]=[]
  TRABAJADORes:Usuario[]=[];
  embarcacionForm!: FormGroup;
  isSubmitting = false;
  isEditMode = false;
  _id:string | null=null;
  searchActions: string[][] = [];
  serviciosSeleccionados: string[] = [];
  nuevaAccion = { nombre: '', fecha: '' };
  servicios: any[] = [];
  expandedServices: boolean[] = [];
  expandedStates: boolean[][] = [];
  selectedServicios: string[] = [];
  selectedAcciones: { [key: string]: { [key: string]: string[] } } = {};
  mostrarComentario: { [key: string]: boolean } = {};
  empresas: any[] = [];
  mensaje: string = '';
  rolUsuario: string = '';

  private searchControlsMap = new Map<string, FormControl>();
  private accionesCache = new Map<string, IAccion[]>();
  private accionesFiltradasMap = new Map<string, BehaviorSubject<IAccion[]>>();
  constructor(private userService:UsuariosService,
    private clienteService:ClienteService,
    private empresaService:EmpresaService,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
  private embarcacionesService:EmbarcacionesService,
  private modalController: ModalController,
  private route: ActivatedRoute,
  private authService: AuthService) { 
      this.buidForm();
  }

    private buidForm(){
      this.embarcacionForm = this.formBuilder.group({
        empresa_cliente_id: ['', Validators.required],
        nombre_empresa_cliente: ['', Validators.required],
        titulo_embarcacion: ['', Validators.required],
        destino_embarcacion:['',Validators.required],
        pais_embarcacion: ['', Validators.required],
        fecha_arribo:[''],
        fecha_zarpe:[''],
        clientes: [[]],
        is_activated: [true],
        TRABAJADORes: [[]],
        servicios: this.formBuilder.array([]),
        fecha_estimada_zarpe: [''],
        da_numero:['', Validators.required],
      });
      // Forzar a string si ya hay valor inicial
      const val = this.embarcacionForm.get('empresa_cliente_id')?.value;
      if (val && typeof val !== 'string') {
        this.embarcacionForm.patchValue({ empresa_cliente_id: String(val) });
      }
    }
    ngOnInit(): void {
      // Obtener el rol del usuario
      this.rolUsuario = this.authService.getRoleFromToken() ?? '';
      
      this.route.paramMap.subscribe(params => {
        const id = params.get('_id'); // asegúrate de que el parámetro se llame 'id'
        this.isEditMode = !!id;   
        // Cargar siempre las listas de clientes y TRABAJADORes
        this.getAllClientes();
        this.getAllTRABAJADORes();
        this.servicios = this.embarcacionesService.getServicios();
        
        if (this.isEditMode && id) {
          this._id = id;
          this.cargarEmbarcacion(id);
        }
      });
      this.cargarEmpresasCliente();
    }
    
    toggleExpand(index: number) {
      this.expandedServices[index] = !this.expandedServices[index];
    }
    toggleComentario(servicioNombre: string, estadoNombre: string, accionNombre: string) {
      const key = `${servicioNombre}-${estadoNombre}-${accionNombre}`;
      const accionesFormArray = this.getAccionesFormArray(servicioNombre, estadoNombre);
    
      let accionGroup = accionesFormArray.controls.find(
        (ctrl: any) => ctrl.value.nombre === accionNombre
      ) as FormGroup;
    
      // Si no existe (acción aún no marcada), la agregamos
      if (!accionGroup) {
        accionGroup = this.formBuilder.group({
          nombre: [accionNombre],
          fecha: [''],
          comentario: [''],
          incidente: [false]
        });
        accionesFormArray.push(accionGroup);
      }
    
            // Alternar visibilidad
        const mostrar = !this.mostrarComentario[key];
        this.mostrarComentario[key] = mostrar;

        const comentarioControl = accionGroup.get('comentario');
        
        // Evaluar si hay contenido inicialmente - forzar a que sea un string antes de usar trim()
  const valorActual = comentarioControl?.value || '';
  const tieneTexto = valorActual.toString().trim() !== '';
  accionGroup.get('incidente')?.setValue(tieneTexto, { emitEvent: false });
  console.log(`Estado inicial - Comentario: "${valorActual}" - Incidente: ${tieneTexto}`);

  // Solo suscribirse una vez - mejora en la evaluación
  if (!(comentarioControl as any)._subscribed) {
    comentarioControl?.valueChanges.subscribe((valor: any) => {
      // Convertir explícitamente a string y asegurar que no sea null/undefined
      const textoSeguro = valor !== null && valor !== undefined ? valor.toString() : '';
      const hayTexto = textoSeguro.trim() !== '';
      
      // Actualizar el estado del incidente inmediatamente
      accionGroup.get('incidente')?.setValue(hayTexto, { emitEvent: false });
      console.log(`Comentario cambiado: "${textoSeguro}" - Incidente: ${hayTexto}`);
    });
    (comentarioControl as any)._subscribed = true;
  }
    }
    
    private formatearFechaParaInput(fecha: Date | string | undefined | null): string | null {
    if (!fecha) return null;

    if (typeof fecha === 'string') {
      return fecha.split('T')[0];  // si es string, separar en "T"
    } else if (fecha instanceof Date) {
      return fecha.toISOString().split('T')[0]; // si es Date, pasarlo a ISO y luego separar
    }
    return null;
}


    toggleExpandEstado(i: number, j: number) {
      // Si no existe el array para el servicio i, lo inicializamos
      if (!this.expandedStates[i]) {
        this.expandedStates[i] = [];
      }
      this.expandedStates[i][j] = !this.expandedStates[i][j];
    }
    cargarEmbarcacion(id: string): void {
      this.embarcacionesService.getEmbarcacionById(id).subscribe(
        data => {
          console.log('Embarcación cargada:', data.data);
          this.embarcacionForm.patchValue({
            titulo_embarcacion: data.data.titulo_embarcacion,
            destino_embarcacion: data.data.destino_embarcacion,
            fecha_arribo:this.formatearFechaParaInput(data.data.fecha_arribo),
            fecha_zarpe:this.formatearFechaParaInput( data.data.fecha_zarpe),
            clientes: data.data.clientes.map((cliente: any) => cliente.cliente_id),
            is_activated: data.data.is_activated,
            TRABAJADORes: data.data.trabajadores.map((TRABAJADOR: any) => TRABAJADOR.TRABAJADORId),
            da_numero: data.data.da_numero || '' ,
          });
       // Populate services
       if (data.data.servicios && data.data.servicios.length > 0) {
        // Clear existing services
        this.serviciosFormArray.clear();
        this.selectedServicios = []; // Reset selected services
        this.selectedAcciones = {}; // Reset selected actions
        
        
        // Expand all service sections
        this.expandedServices = new Array(data.data.servicios.length).fill(false);

        // Add each service
        data.data.servicios.forEach((servicio: any, index: number) => {
        
          // Mark service as selected
          this.selectedServicios.push(servicio.nombre_servicio);
        
          // Prepare action tracking for this service
          this.selectedAcciones[servicio.nombre_servicio] = {};

          const servicioForm = this.formBuilder.group({
            nombre_servicio: [servicio.nombre_servicio],
            estados: this.formBuilder.array(
              servicio.estados.map((estado: any) => {
                // Track actions for this estado
                this.selectedAcciones[servicio.nombre_servicio][estado.nombre_estado] = 
                  estado.acciones ? estado.acciones.map((accion: any) => accion.nombre) : [];

        
                return this.formBuilder.group({
                  nombre_estado: [estado.nombre_estado],
                  acciones: this.formBuilder.array(
                    estado.acciones ? estado.acciones.map((accion: any) => 
                      this.formBuilder.group({
                        nombre: [accion.nombre],
                        fecha:[accion.fecha],
                        comentario:[accion.comentario],
                        incidente:[accion.incidente]
                        
                      })
                    ) : []
                    
                  )
                });
              })
            )
          });
          
          this.serviciosFormArray.push(servicioForm);
        });

        
      } else {
        
      }
        },
        error => {
          this.presentToast('Error al cargar la embarcación','danger');
        }
      );
    }
  
    get serviciosFormArray() {
      return this.embarcacionForm.get('servicios') as FormArray;
    }

    onServicioSelect(event: any) {
      // Asegurarse de que selectedServicios sea un array
      if (!Array.isArray(this.selectedServicios)) {
        this.selectedServicios = [];
      }

      // Obtener el valor seleccionado (puede ser string o array)
      let value = event.detail ? event.detail.value : event;
      if (!Array.isArray(value)) {
        value = value ? [value] : [];
      }

      // Actualizar selectedServicios (agregar solo los nuevos)
      this.selectedServicios = [
        ...this.selectedServicios,
        ...value.filter((v: string) => !this.selectedServicios.includes(v))
      ];

      // Agregar los nuevos servicios seleccionados
      value.forEach((nombreServicio: string) => {
        if (!this.serviciosFormArray.controls.some(ctrl => ctrl.value.nombre_servicio === nombreServicio)) {
          const servicio = this.servicios.find(s => s.nombre_servicio === nombreServicio);
          if (servicio) {
            this.agregarServicio(servicio);
          }
        }
      });
    }
    getAllTRABAJADORes() {
  this.userService.getUsersByRole(1, 100, 'TRABAJADOR').subscribe(
    (response) => {
      console.log("✅ Usuarios tipo TRABAJADOR recibidos:", response);

      // ✅ usa .users en lugar de .usuarios
      this.TRABAJADORes = response.users;

      console.log("👉 Trabajadores filtrados:", this.TRABAJADORes);
    },
    (error) => {
      console.error("❌ Error al traer trabajadores:", error);
    }
  );
}


  getAllClientes(){
    console.log('🔄 Iniciando carga de empresas cliente...');
    
    // Obtener todas las empresas cliente
    this.empresaService.getClientesEmpresa().subscribe({
      next: (empresas: any[]) => {
        console.log('✅ Empresas cliente obtenidas:', empresas);
        console.log('📊 Total de empresas recibidas:', empresas?.length || 0);
        
        if (empresas && empresas.length > 0) {
          console.log('🔍 Primera empresa como ejemplo:', empresas[0]);
          console.log('🔍 Campos disponibles en la primera empresa:', Object.keys(empresas[0]));
        }
        
        // Mapear las empresas a la estructura esperada por el componente
        this.clientes = empresas.map((empresa: any) => ({
          _id: empresa._id,
          nombre_cliente: empresa.nombre_empresa || 'Sin nombre',
          pais_cliente: empresa.pais || '',
          dato_contacto_cliente: empresa.telefono || empresa.correo || '',
          empresa_cliente: empresa.nombre_empresa || '',
          foto_cliente: '' // Campo requerido por el modelo Cliente
        }));
        
        console.log('✅ Empresas mapeadas exitosamente:', this.clientes);
        console.log('📊 Total de empresas disponibles para selección:', this.clientes.length);
        
        if (this.clientes.length === 0) {
          console.warn('⚠️ No se encontraron empresas cliente');
          this.presentToast('No se encontraron empresas cliente disponibles', 'warning');
        }
      },
      error: (error: any) => {
        console.error('❌ Error al obtener empresas cliente:', error);
        console.error('❌ Detalles del error:', error.error);
        this.presentToast('Error al cargar las empresas cliente', 'danger');
      }
    });
  }

  
  saveEmbarcacion() {
    if (this.embarcacionForm.invalid) {
      this.presentToast('Por favor, completa los campos requeridos','warning');
      return;
    }
  
    // Tomar los valores del formulario
    const formValue = this.embarcacionForm.value;
  
    // Mapear clientes a la estructura esperada por el backend
    const clientes = Array.isArray(formValue.clientes)
      ? formValue.clientes.filter((id: any) => !!id).map((id: string) => ({ cliente_id: id }))
      : [];
  
    // Mapear trabajadores a la estructura esperada por el backend
    let trabajadores;
    if (this.rolUsuario === 'TRABAJADOR') {
      // Si es trabajador, asignarse automáticamente a sí mismo
      const trabajadorId = this.authService.getIdFromToken();
      trabajadores = trabajadorId ? [{ trabajadorId: trabajadorId }] : [];
    } else {
      // Si es administrador, usar la selección del formulario
      trabajadores = Array.isArray(formValue.TRABAJADORes)
        ? formValue.TRABAJADORes.filter((id: any) => !!id).map((id: string) => ({ trabajadorId: id }))
        : [];
    }
  
    // ✅ Asegurar que empresa_cliente_id es un string válido
    const empresaClienteId = formValue.empresa_cliente_id;
    const empresaClienteIdString = typeof empresaClienteId === 'string'
      ? empresaClienteId
      : empresaClienteId?._id || empresaClienteId?.$oid || '';
  
    // Construir el objeto de datos para enviar
    const data = {
      empresa_cliente_id: String(empresaClienteIdString), // 🔒 Forzamos a string seguro
      nombre_empresa_cliente: formValue.nombre_empresa_cliente,
      titulo_embarcacion: formValue.titulo_embarcacion,
      destino_embarcacion: formValue.destino_embarcacion,
      pais_embarcacion: formValue.pais_embarcacion,
      da_numero: formValue.da_numero,
      fecha_arribo: formValue.fecha_arribo,
      fecha_estimada_zarpe: formValue.fecha_estimada_zarpe,
      fecha_zarpe: formValue.fecha_zarpe,
      clientes,
      is_activated: formValue.is_activated,
      trabajadores,
      servicios: formValue.servicios || []
    };
  
    // ✅ Envío al backend
    this.embarcacionesService.crearEmbarcacion(data).subscribe({
      next: () => {
        this.mensaje = '¡Embarcación registrada con éxito!';
        this.resetForm(); // Puedes resetear si quieres limpiar
      },
      error: err => {
        console.error('❌ Error al registrar embarcación:', err);
        this.mensaje = 'Error al registrar embarcación: ' + (err.error?.message || err.message);
        this.presentToast(this.mensaje, 'danger');
      }
    });
  }
  
  
  // ✅ Método para actualizar una embarcación
  private updateEmbarcacion(data: any) {
    console.log('datos enviados a actualizar:',data)
    this.embarcacionesService.updateEmbarcacion(this._id!, data).subscribe({
      next: async () => {
        this.isSubmitting = false;
        await this.presentToast('¡Embarcación actualizada con éxito!','success');
      },
      error: async (err) => {
        this.isSubmitting = false;
        console.error('Error al actualizar embarcación:', err);
        await this.presentToast('Error al actualizar la embarcación','danger');
      }
    });
  }
  
  // ✅ Resetear formulario tras creación
  private resetForm() {
    this.embarcacionForm.reset({
      titulo_embarcacion: '',
      destino_embarcacion: '',
      clientes: [],
      is_activated: true,
      TRABAJADORes: [],
      servicios: [],
      nombre_empresa_cliente: ''
    });
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
  // 🔹 Filtra solo los servicios seleccionados
get serviciosFiltrados(): IServicio[] {
  const seleccionados = new Set(this.serviciosSeleccionados);
  return this.servicios.filter(servicio => seleccionados.has(servicio.nombre_servicio));
}

getFilteredAcciones(servicioNombre: string, estadoNombre: string): Observable<IAccion[]> {
  const cacheKey = `${servicioNombre}-${estadoNombre}`;

  // ✅ Si ya existe un Observable para este estado, devolverlo
  if (this.accionesFiltradasMap.has(cacheKey)) {
    return this.accionesFiltradasMap.get(cacheKey)!.asObservable();
  }

  // 🔹 Obtener las acciones disponibles para el estado del servicio
  let accionesIniciales = this.getAccionesDisponibles(servicioNombre, estadoNombre) || [];

  // 🔹 Crear un BehaviorSubject para manejar cambios dinámicos
  const behaviorSubject = new BehaviorSubject<IAccion[]>(accionesIniciales);
  this.accionesFiltradasMap.set(cacheKey, behaviorSubject);

  return behaviorSubject.asObservable();
}


getSearchControl(servicioNombre: string, estadoNombre: string): FormControl {
  const key = `${servicioNombre}-${estadoNombre}`;

  // ✅ Si el control ya existe, retornarlo
  if (this.searchControlsMap.has(key)) {
    return this.searchControlsMap.get(key) as FormControl;
  }

  // ✅ Crear un nuevo control si no existe
  const newControl = new FormControl('');

  // ✅ Guardarlo en el mapa
  this.searchControlsMap.set(key, newControl);

  // ✅ Cuando el usuario escribe, actualizar el filtro en tiempo real
  newControl.valueChanges.subscribe(value => {
    this.filterAcciones(servicioNombre, estadoNombre, value);
  });

  return newControl;
}
 

filterAcciones(servicioNombre: string, estadoNombre: string, query: string | null) {
  const cacheKey = `${servicioNombre}-${estadoNombre}`;

  const searchQuery = (query ?? '').trim().toLowerCase();

  // ✅ Obtener las acciones originales usando nombres en lugar de índices
  const todasLasAcciones = this.getAccionesDisponibles(servicioNombre, estadoNombre);

  // ✅ Filtrar las acciones según la búsqueda
  const accionesFiltradas = !searchQuery
    ? todasLasAcciones
    : todasLasAcciones.filter(accion => accion.nombre.toLowerCase().includes(searchQuery));

  // ✅ Actualizar el Observable con los valores filtrados
  if (this.accionesFiltradasMap.has(cacheKey)) {
    this.accionesFiltradasMap.get(cacheKey)?.next(accionesFiltradas);
  } else {
    this.accionesFiltradasMap.set(cacheKey, new BehaviorSubject<IAccion[]>(accionesFiltradas));
  }
}


agregarServicio(servicio: IServicio) {
  if (!servicio || !servicio.nombre_servicio) {
    console.error('Error: Intento de agregar un servicio undefined o sin nombre_servicio:', servicio);
    return;
  }

  const servicioForm = this.formBuilder.group({
    nombre_servicio: [servicio.nombre_servicio, Validators.required], // 🔹 Asegurar que siempre tenga un valor
    estados: this.formBuilder.array(servicio.estados?.map((estado: IEstado) =>
      this.formBuilder.group({
        nombre_estado: [estado.nombre_estado || ''], // Evita valores undefined
        acciones: this.formBuilder.array([]),
        searchAction: this.formBuilder.control('')
      })
    ) ?? []) // Si estados es undefined, usa un array vacío
  });
  this.serviciosFormArray.push(servicioForm);
}

getEstadosFormArray(servicioNombre: string): FormArray {
  const servicioFormGroup = this.serviciosFormArray.controls.find(
      ctrl => ctrl.value.nombre_servicio === servicioNombre
  );

  if (!servicioFormGroup) {
      console.error(`❌ Servicio "${servicioNombre}" no encontrado.`);
      
  }

  return servicioFormGroup?.get('estados') as FormArray;
}

getAccionesFormArray(servicioNombre: string, estadoNombre: string): FormArray {
  const estadosFormArray = this.getEstadosFormArray(servicioNombre);
  const estadoFormGroup = estadosFormArray.controls.find(
      ctrl => ctrl.value.nombre_estado === estadoNombre
  );

  if (!estadoFormGroup) {
      console.error(`❌ Estado "${estadoNombre}" no encontrado en el servicio "${servicioNombre}".`);
      
  }

  return estadoFormGroup?.get('acciones') as FormArray;
}
  
  getAccionesDisponibles(servicioNombre: string, estadoNombre: string): IAccion[] {
    const cacheKey = `${servicioNombre}-${estadoNombre}`;
  
    // ✅ Si ya está en caché, devolverlo
    if (this.accionesCache.has(cacheKey)) {
      return this.accionesCache.get(cacheKey) as IAccion[];
    }
  
    // 🔹 Buscar el servicio por nombre
    const servicio = this.servicios.find(s => s.nombre_servicio === servicioNombre);
    if (!servicio) return [];
  
    // 🔹 Buscar el estado por nombre dentro del servicio
    const estado = servicio.estados.find((e:any) => e.nombre_estado === estadoNombre);
    if (!estado) return [];
  
    // ✅ Guardamos las acciones en caché para evitar futuras búsquedas innecesarias
    const acciones = estado.acciones;
    this.accionesCache.set(cacheKey, acciones);
    return acciones;
  }
  

  toggleAccion(servicioNombre: string, estadoNombre: string, accion: IAccion, event: any) {
    const accionesFormArray = this.getAccionesFormArray(servicioNombre, estadoNombre);
  
    if (event.detail.checked) {
      if (!accionesFormArray.value.some((a:IAccion) => a.nombre === accion.nombre)) {
        accionesFormArray.push(this.formBuilder.group({ nombre: [accion.nombre],
          fecha: [accion.fecha],        // ⬅ incluir fecha
          comentario: [accion.comentario],
          incidente:[accion.incidente]
         }));
      }
    } else {
      const index = accionesFormArray.controls.findIndex(ctrl => ctrl.value.nombre === accion.nombre);
      if (index !== -1) {
        accionesFormArray.removeAt(index);
      }
    }
  }
  
  agregarAccion(servicioNombre: string, estadoNombre: string) {
    // 1. Obtenemos el FormArray de acciones seleccionadas
    const accionesFormArray = this.getAccionesFormArray(servicioNombre, estadoNombre);

    // 2. Mapeamos para crear un array base que el modal editará
    const accionesSinFecha = accionesFormArray.value.map((accion: any) => {
      return {
        nombre: accion.nombre,
        fecha: accion.fecha || new Date().toISOString(),  // Valor inicial, si quieres
        comentario: accion.comentario,
        incidente:accion.incidente                     // Valor inicial
      };
    });

    // 3. Abrimos el modal y le pasamos las acciones
    this.openAccionModal(accionesSinFecha, servicioNombre, estadoNombre);
  }

  async openAccionModal(
    acciones: any[],
    servicioNombre: string,
    estadoNombre: string
  ) {
    const modal = await this.modalController.create({
      component: AccionModalComponent,
      componentProps: {
        acciones: acciones
      }
    });

    await modal.present();

    // 4. Capturamos el resultado cuando el modal se cierra
    const { data, role } = await modal.onDidDismiss();
    if (role === 'confirm' && data?.acciones) {
      // data.acciones: el array final (reordenado, con fechas y comentarios)

      this.sincronizarAccionesConFormArray(servicioNombre, estadoNombre, data.acciones);
      //    Pero en "crear" no funciona porque aún no tienes this._id
      if (this.isEditMode && this._id) {
        const body = {
          nombre_servicio: servicioNombre,
          nombre_estado: estadoNombre,
          acciones: data.acciones
        };
        this.enviarAccionesAlBackend(body);
      }
    }
  }

  enviarAccionesAlBackend(body: any) {
    // Ajusta con el _id real de la embarcación
    this.embarcacionesService.agregarAcciones(this._id, body).subscribe(
      resp => {
        
      },
      error => {
        console.error('Error al actualizar:');
        // ... toast de error ...
      }
    );
  }
  
  private sincronizarAccionesConFormArray(servicioNombre: string, estadoNombre: string, accionesReordenadas: any[]) {
    const accionesFormArray = this.getAccionesFormArray(servicioNombre, estadoNombre);
  
    // Borramos las acciones que ya hubiera
    while (accionesFormArray.length > 0) {
      accionesFormArray.removeAt(0);
    }
  
    // Usamos un Set para prevenir duplicados por nombre
    const nombresAcciones = new Set();
  
    // Insertamos las acciones nuevas, en el orden que vengan, evitando duplicados
    for (const accion of accionesReordenadas) {
      // Si ya existe una acción con ese nombre, la omitimos
      if (!nombresAcciones.has(accion.nombre)) {
        nombresAcciones.add(accion.nombre);
        accionesFormArray.push(
          this.formBuilder.group({
            nombre: [accion.nombre],
            fecha: [accion.fecha],
            comentario: [accion.comentario],
            incidente:[accion.incidente],
            orden: [accion.orden ?? null]
          })
        );
      }
    }
  }
  getComentarioControl(servicioNombre: string, estadoNombre: string, accionNombre: string): FormControl {
    const accionesFormArray = this.getAccionesFormArray(servicioNombre, estadoNombre);
    const accionGroup = accionesFormArray?.controls.find(
      (ctrl: any) => ctrl.value.nombre === accionNombre
    ) as FormGroup | undefined;
  
    const control = accionGroup?.get('comentario');
    return control instanceof FormControl ? control : new FormControl('');
  }
  
  actualizarEstadoIncidente(servicioNombre: string, estadoNombre: string, accionNombre: string, event: any) {
    const accionesFormArray = this.getAccionesFormArray(servicioNombre, estadoNombre);
    const accionGroup = accionesFormArray?.controls.find(
      (ctrl: any) => ctrl.value.nombre === accionNombre
    ) as FormGroup;
    
    if (accionGroup) {
      // Extraer el valor y manejarlo de forma segura
      const valor = event.detail.value !== null && event.detail.value !== undefined 
        ? event.detail.value.toString() 
        : '';
      
      const hayTexto = valor.trim() !== '';
      accionGroup.get('incidente')?.setValue(hayTexto, { emitEvent: false });
      console.log(`Input directo - Valor: "${valor}" - Incidente actualizado: ${hayTexto}`);
    }
  }
  
  quitarServicio(nombreServicio: string) {
    const index = this.serviciosFormArray.controls.findIndex(
      ctrl => ctrl.value.nombre_servicio === nombreServicio
    );
    if (index !== -1) {
      this.serviciosFormArray.removeAt(index);
    }
    // Quitar de selectedServicios
    this.selectedServicios = this.selectedServicios.filter(s => s !== nombreServicio);
    // Quitar de selectedAcciones
    if (this.selectedAcciones[nombreServicio]) {
      delete this.selectedAcciones[nombreServicio];
    }
    // Actualizar expandedServices
    this.expandedServices = this.expandedServices.filter((_, i) => i !== index);
  }

  cargarEmpresasCliente() {
    this.empresaService.getClientesEmpresa().subscribe(empresas => {
      this.empresas = empresas;
    });
  }

  onEmpresaChange(event: any) {
    const empresaId = String(event.detail?.value || event.target?.value || '');
    const empresa = this.empresas.find(emp => String(emp._id) === empresaId);
  
    this.embarcacionForm.patchValue({
      empresa_cliente_id: empresaId,
      nombre_empresa_cliente: empresa?.nombre_empresa || ''
    });
  }
  
  
  
  
}
