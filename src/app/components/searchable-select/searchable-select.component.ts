import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import{IonItem,IonLabel,IonInput,IonIcon,IonList,IonChip} from'@ionic/angular/standalone'
@Component({
  selector: 'app-searchable-select',
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.scss'],
  imports:[CommonModule,IonItem,IonLabel,IonInput,IonIcon,IonList,IonChip,FormsModule],
})
export class SearchableSelectComponent  implements OnInit {

  @Input() items: any[] = [];
  @Input() label: string = 'Seleccionar';
  @Input() displayProperty: string = 'name';
  @Input() valueProperty: string = 'id';
  @Input() placeholder: string = 'Seleccionar pais';
  
  // Cambiamos el tipo del evento para que emita el valor seleccionado (que puede ser un string u objeto)
  @Output() selectionChange = new EventEmitter<any>();
  
  keyword: string = '';
  filteredItems: any[] = [];
  selectedItem: any = null;
  isOpen: boolean = false;

  ngOnInit() {
    this.filteredItems = [...this.items];
  }

  filterItems() {
    const searchTerm = this.keyword.trim().toLowerCase();
  
    if (!searchTerm) {
      this.filteredItems = [];   // ✅ Ahora oculta todos los resultados
      this.isOpen = false;       // ✅ Opcional: también puedes ocultar el dropdown
      return;
    }
  
    this.filteredItems = this.items.filter(item => {
      const displayValue = this.getDisplayValue(item).toLowerCase();
      return displayValue.includes(searchTerm);
    });
  
    this.isOpen = true;
  }
  

  selectItem(item: any) {
    this.selectedItem = item;
    this.keyword = '';
    this.isOpen = false;
    
    // Emite el valor final (no el objeto Event)
    this.selectionChange.emit(item);
  }

  isItemSelected(item: any): boolean {
    if (!this.selectedItem) return false;
    return this.getValue(item) === this.getValue(this.selectedItem);
  }

  clearSelection() {
    this.selectedItem = null;
    // Emite null cuando se borra la selección
    this.selectionChange.emit(null);
  }

  getDisplayValue(item: any): string {
    if (!item) return '';
    return typeof item === 'object' ? item[this.displayProperty] : item.toString();
  }

  getValue(item: any): any {
    if (!item) return null;
    return typeof item === 'object' ? item[this.valueProperty] : item;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.filteredItems = [...this.items];
    }
  }

}
