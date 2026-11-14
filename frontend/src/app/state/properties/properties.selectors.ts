import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PropertiesState } from './properties.reducer';

export const selectPropertiesState =
  createFeatureSelector<PropertiesState>('properties');

export const selectPropertiesList = createSelector(
  selectPropertiesState,
  (state: PropertiesState) => state.list
);

export const selectSelectedProperty = createSelector(
  selectPropertiesState,
  (state: PropertiesState) => state.selectedProperty
);

export const selectPropertiesLoading = createSelector(
  selectPropertiesState,
  (state: PropertiesState) => state.loading
);

export const selectPropertiesSaving = createSelector(
  selectPropertiesState,
  (state: PropertiesState) => state.saving
);

export const selectPropertiesError = createSelector(
  selectPropertiesState,
  (state: PropertiesState) => state.error
);
