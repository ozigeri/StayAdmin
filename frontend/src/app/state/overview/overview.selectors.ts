import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OverviewState } from './overview.reducer';

export const selectOverviewState =
  createFeatureSelector<OverviewState>('overview');

export const selectOverviewSelectedPropertyId = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.selectedPropertyId
);

export const selectOverviewData = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.data
);

export const selectOverviewLoading = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.loading
);

export const selectOverviewError = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.error
);
