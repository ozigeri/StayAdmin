import { createAction, props } from '@ngrx/store';
import { PropertyOverview } from '../../core/models';

export const loadOverview = createAction(
  '[Overview] Load Overview',
  props<{ propertyId: string }>()
);

export const loadOverviewSuccess = createAction(
  '[Overview] Load Overview Success',
  props<{ overview: PropertyOverview }>()
);

export const loadOverviewFailure = createAction(
  '[Overview] Load Overview Failure',
  props<{ error: string }>()
);

export const selectOverviewProperty = createAction(
  '[Overview] Select Property',
  props<{ propertyId: string }>()
);
