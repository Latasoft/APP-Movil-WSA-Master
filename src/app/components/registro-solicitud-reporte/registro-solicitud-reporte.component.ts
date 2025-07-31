import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SolicitudReporteService } from 'src/app/services/solicitud-reporte.service';

@Component({
  selector: 'app-registro-solicitud-reporte',
  templateUrl: './registro-solicitud-reporte.component.html',
  styleUrls: ['./registro-solicitud-reporte.component.scss'],
})
export class RegistroSolicitudReporteComponent  implements OnInit {
  solicitudForm:FormGroup=new FormGroup({});
  userId:string='';
  constructor(private solicitarReporteService:SolicitudReporteService,
    private fb:FormBuilder,private authService:AuthService
  ) {
    this.crearFormulario();
   }

  ngOnInit() {
    this.getUserId();
  }

  getUserId(){
    this.userId=this.loadUserId()??'';
  }

  loadUserId(){
    return this.authService.getIdFromToken();
  }
  private crearFormulario(){
    this.solicitudForm=this.fb.group({
      rango_fecha_inicio:[''],
      rango_fecha_termino:['']
    });
  }

  onSubmit(){
    
  }
}
