import { createReducer, on } from '@ngrx/store';
import { PropertyOverview } from '../../core/models';
import * as OverviewActions from './overview.actions';

export interface OverviewState {
  selectedPropertyId: string | null;
  data: PropertyOverview | null;
  loading: boolean;
  error: string | null;
}

export const initialOverviewState: OverviewState = {
  selectedPropertyId: null,
  data: null,
  loading: false,
  error: null,
};

export const overviewReducer = createReducer(
  initialOverviewState,
  on(OverviewActions.selectOverviewProperty, (state, { propertyId }) => ({
    ...state,
    selectedPropertyId: propertyId,
  })),
  on(OverviewActions.loadOverview, (state, { propertyId }) => ({
    ...state,
    selectedPropertyId: propertyId,
    loading: true,
    error: null,
  })),
  on(OverviewActions.loadOverviewSuccess, (state, { overview }) => ({
    ...state,
    data: overview,
    loading: false,
    error: null,
  })),
  on(OverviewActions.loadOverviewFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
