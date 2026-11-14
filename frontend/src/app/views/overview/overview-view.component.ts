import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { CardComponent } from '../../components/card/card.component';
import { SelectComponent, SelectOption } from '../../components/select/select.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { IconComponent } from '../../components/icon/icon.component';
import * as PropertiesActions from '../../state/properties/properties.actions';
import * as OverviewActions from '../../state/overview/overview.actions';
import { selectPropertiesList } from '../../state/properties/properties.selectors';
import {
  selectOverviewData,
  selectOverviewLoading,
  selectOverviewSelectedPropertyId,
} from '../../state/overview/overview.selectors';

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
export class OverviewViewComponent implements OnInit {
  private readonly store = inject(Store);

  protected readonly properties = this.store.selectSignal(selectPropertiesList);
  protected readonly selectedPropertyId = this.store.selectSignal(
    selectOverviewSelectedPropertyId
  );
  protected readonly overviewData = this.store.selectSignal(selectOverviewData);
  protected readonly loading = this.store.selectSignal(selectOverviewLoading);

  protected readonly propertyOptions = computed<SelectOption[]>(() =>
    this.properties().map((p) => ({
      label: `${p.name} (${p.location})`,
      value: p.id,
    }))
  );

  constructor() {
    effect(() => {
      const list = this.properties();
      const currentSelected = this.selectedPropertyId();
      if (!currentSelected && list.length > 0) {
        this.store.dispatch(
          OverviewActions.loadOverview({ propertyId: list[0].id })
        );
      }
    });
  }

  ngOnInit(): void {
    this.store.dispatch(PropertiesActions.loadProperties({}));
  }

  handlePropertyChange(propertyId: string | number): void {
    if (propertyId) {
      this.store.dispatch(
        OverviewActions.loadOverview({ propertyId: String(propertyId) })
      );
    }
  }
}
