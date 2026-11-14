import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { SelectComponent, SelectOption } from '../../components/select/select.component';
import { CardComponent } from '../../components/card/card.component';
import { BadgeComponent, BadgeVariant } from '../../components/badge/badge.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { IconComponent } from '../../components/icon/icon.component';
import { PropertyListItem, EPropertyCategory } from '../../core/models';
import * as PropertiesActions from '../../state/properties/properties.actions';
import {
  selectPropertiesList,
  selectPropertiesLoading,
} from '../../state/properties/properties.selectors';

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
export class PropertiesViewComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected readonly properties = this.store.selectSignal(selectPropertiesList);
  protected readonly loading = this.store.selectSignal(selectPropertiesLoading);

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

  ngOnInit(): void {
    this.store.dispatch(PropertiesActions.loadProperties({}));
  }

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
    const q = String(query);
    this.searchQuery.set(q);
    this.triggerFilter();
  }

  handleCategoryChange(category: string | number): void {
    const c = String(category);
    this.selectedCategory.set(c);
    this.triggerFilter();
  }

  private triggerFilter(): void {
    this.store.dispatch(
      PropertiesActions.loadProperties({
        name: this.searchQuery(),
        category: this.selectedCategory(),
      })
    );
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
    const target = this.propertyToDelete();
    if (target) {
      this.store.dispatch(PropertiesActions.deleteProperty({ id: target.id }));
    }
    this.isDeleteModalOpen.set(false);
    this.propertyToDelete.set(null);
  }
}
