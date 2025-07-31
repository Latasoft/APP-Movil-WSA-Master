import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'servicioFilter',
  standalone: true
})
export class ServicioFilterPipe implements PipeTransform {
  transform(servicios: any[], busqueda: string): any[] {
    if (!busqueda || !servicios) return servicios;

    const filtro = busqueda.toLowerCase();
    return servicios.filter(servicio =>
      servicio.principal?.toLowerCase().includes(filtro) ||
      servicio.subtitulo?.toLowerCase().includes(filtro)
    );
  }
}
