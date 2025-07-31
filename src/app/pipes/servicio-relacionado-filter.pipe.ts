import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'servicioRelacionadoFilter',
  standalone: true
})
export class ServicioRelacionadoFilterPipe implements PipeTransform {
  transform(serviciosRelacionados: any[], busqueda: string): any[] {
    if (!busqueda || !serviciosRelacionados) return serviciosRelacionados;

    const filtro = busqueda.toLowerCase();
    return serviciosRelacionados.filter(servicio =>
      servicio.nombre.toLowerCase().includes(filtro)
    );
  }
}
