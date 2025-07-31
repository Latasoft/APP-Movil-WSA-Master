import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonRadioGroup,
  IonRadio,
  IonIcon
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-select',
  templateUrl: './filter-select.component.html',
  styleUrls: ['./filter-select.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonRadioGroup,
    IonRadio,
    IonIcon
  ]
})
export class FilterSelectComponent {
  /** 
   * Lista completa de ítems. Cada ítem debe tener las propiedades definidas por 
   * itemTextField y itemValueField. 
   */
  @Input() items: any[] = [];

  /** Campo que se muestra en la interfaz (ej: 'nombre') */
  @Input() itemTextField: string = 'nombre';

  /** Campo que se utiliza como valor al seleccionar (ej: '_id') */
  @Input() itemValueField: string = '_id';

  /** Indica si es selección múltiple (true) o única (false) */
  @Input() multiple: boolean = false;

  /**
   * Valor(es) seleccionado(s):
   * - Si multiple = false, será un string (o number, etc.) con el valor seleccionado
   * - Si multiple = true, será un array con los valores seleccionados
   */
  @Input() selected: any = null;

  /**
   * Emite el valor seleccionado cada vez que cambia.
   * - En selección única, un solo valor (por ej, el _id del item)
   * - En selección múltiple, un array de valores
   */
  @Output() selectedChange = new EventEmitter<any>();

  /** Texto de búsqueda que se ingresa en el ion-searchbar */
  searchText: string = '';

  /** Placeholder personalizado para el buscador */
  @Input() placeholder: string = '';

  /** Retorna la lista filtrada según lo que se escriba en el searchbar */
  get filteredItems() {
    const text = this.searchText.toLowerCase();
    return this.items.filter(item => {
      const fieldValue = (item[this.itemTextField] || '').toLowerCase();
      return fieldValue.includes(text);
    });
  }

  /**
   * Maneja el evento (ionChange) de los checkboxes en selección múltiple:
   * agrega o quita el valor del array de seleccionados.
   */
  onCheckChange(item: any) {
    if (!Array.isArray(this.selected)) {
      this.selected = [];
    }
    const value = item[this.itemValueField];
    const index = this.selected.indexOf(value);
    if (index > -1) {
      this.selected.splice(index, 1);
    } else {
      this.selected.push(value);
    }
    this.selectedChange.emit(this.selected);
  }

  /**
   * Maneja el evento (ionChange) del ion-radio-group en selección única.
   * El valor nuevo está en event.detail.value
   */
  onRadioChange(event: any) {
    this.selected = event.detail.value;
    this.selectedChange.emit(this.selected);
  }

  /** Verifica si el ítem está seleccionado en modo múltiple */
  isChecked(item: any) {
    if (!Array.isArray(this.selected)) {
      return false;
    }
    const value = item[this.itemValueField];
    return this.selected.includes(value);
  }
}
