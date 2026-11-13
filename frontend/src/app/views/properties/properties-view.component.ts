import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { SelectComponent, SelectOption } from '../../components/select/select.component';
import { CardComponent } from '../../components/card/card.component';
import { BadgeComponent, BadgeVariant } from '../../components/badge/badge.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { IconComponent } from '../../components/icon/icon.component';
import { PropertyListItem, EPropertyCategory } from '../../core/models';

@Component({
  selector: 'app-properties-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    CardComponent,
    BadgeComponent,
    ModalComponent,
    EmptyStateComponent,
    IconComponent,
  ],
  templateUrl: './properties-view.component.html',
  styleUrl: './properties-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesViewComponent {
  protected readonly properties = signal<PropertyListItem[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly searchQuery = signal<string>('');
  protected readonly selectedCategory = signal<string>('');

  protected readonly isDeleteModalOpen = signal<boolean>(false);
  protected readonly propertyToDelete = signal<PropertyListItem | null>(null);
  protected readonly deleteLoading = signal<boolean>(false);

  readonly categoryOptions: SelectOption[] = [
    { label: 'Összes kategória', value: '' },
    { label: 'Hotel', value: EPropertyCategory.Hotel },
    { label: 'Panzió', value: EPropertyCategory.Pension },
    { label: 'Apartman', value: EPropertyCategory.Apartment },
    { label: 'Vendégház', value: EPropertyCategory.Guesthouse },
  ];

  constructor(private readonly router: Router) {}

  getCategoryBadgeVariant(cat: EPropertyCategory): BadgeVariant {
    switch (cat) {
      case EPropertyCategory.Hotel:
        return 'hotel';
      case EPropertyCategory.Pension:
        return 'pension';
      case EPropertyCategory.Apartment:
        return 'apartment';
      case EPropertyCategory.Guesthouse:
        return 'guesthouse';
      default:
        return 'neutral';
    }
  }

  getCategoryLabel(cat: EPropertyCategory): string {
    switch (cat) {
      case EPropertyCategory.Hotel:
        return 'Hotel';
      case EPropertyCategory.Pension:
        return 'Panzió';
      case EPropertyCategory.Apartment:
        return 'Apartman';
      case EPropertyCategory.Guesthouse:
        return 'Vendégház';
      default:
        return cat;
    }
  }

  handleSearch(query: string | number): void {
    this.searchQuery.set(String(query));
  }

  handleCategoryChange(category: string | number): void {
    this.selectedCategory.set(String(category));
  }

  navigateToCreate(): void {
    this.router.navigate(['/properties/new']);
  }

  navigateToEdit(id: string): void {
    this.router.navigate(['/properties', id, 'edit']);
  }

  promptDelete(property: PropertyListItem): void {
    this.propertyToDelete.set(property);
    this.isDeleteModalOpen.set(true);
  }

  cancelDelete(): void {
    this.isDeleteModalOpen.set(false);
    this.propertyToDelete.set(null);
  }

  confirmDelete(): void {
    this.isDeleteModalOpen.set(false);
  }
}
