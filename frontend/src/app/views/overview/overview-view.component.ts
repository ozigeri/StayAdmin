import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { CardComponent } from '../../components/card/card.component';
import { SelectComponent, SelectOption } from '../../components/select/select.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { IconComponent } from '../../components/icon/icon.component';
import { PropertyOverview, PropertyListItem } from '../../core/models';

@Component({
  selector: 'app-overview-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatCardComponent,
    CardComponent,
    SelectComponent,
    EmptyStateComponent,
    IconComponent,
  ],
  templateUrl: './overview-view.component.html',
  styleUrl: './overview-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewViewComponent {
  protected readonly properties = signal<PropertyListItem[]>([]);
  protected readonly selectedPropertyId = signal<string>('');
  protected readonly overviewData = signal<PropertyOverview | null>(null);
  protected readonly loading = signal<boolean>(false);

  protected readonly propertyOptions = signal<SelectOption[]>([]);

  handlePropertyChange(propertyId: string | number): void {
    this.selectedPropertyId.set(String(propertyId));
  }
}
