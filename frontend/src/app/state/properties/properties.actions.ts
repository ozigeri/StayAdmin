import { createAction, props } from '@ngrx/store';
import { Property, PropertyListItem, PropertyDto } from '../../core/models';

export const loadProperties = createAction(
  '[Properties] Load Properties',
  props<{ name?: string; category?: string }>()
);

export const loadPropertiesSuccess = createAction(
  '[Properties] Load Properties Success',
  props<{ properties: PropertyListItem[] }>()
);

export const loadPropertiesFailure = createAction(
  '[Properties] Load Properties Failure',
  props<{ error: string }>()
);

export const loadPropertyById = createAction(
  '[Properties] Load Property By Id',
  props<{ id: string }>()
);

export const loadPropertyByIdSuccess = createAction(
  '[Properties] Load Property By Id Success',
  props<{ property: Property }>()
);

export const loadPropertyByIdFailure = createAction(
  '[Properties] Load Property By Id Failure',
  props<{ error: string }>()
);

export const createProperty = createAction(
  '[Properties] Create Property',
  props<{ dto: PropertyDto }>()
);

export const createPropertySuccess = createAction(
  '[Properties] Create Property Success',
  props<{ property: Property }>()
);

export const createPropertyFailure = createAction(
  '[Properties] Create Property Failure',
  props<{ error: string }>()
);

export const updateProperty = createAction(
  '[Properties] Update Property',
  props<{ id: string; dto: PropertyDto }>()
);

export const updatePropertySuccess = createAction(
  '[Properties] Update Property Success',
  props<{ property: Property }>()
);

export const updatePropertyFailure = createAction(
  '[Properties] Update Property Failure',
  props<{ error: string }>()
);

export const deleteProperty = createAction(
  '[Properties] Delete Property',
  props<{ id: string }>()
);

export const deletePropertySuccess = createAction(
  '[Properties] Delete Property Success',
  props<{ id: string }>()
);

export const deletePropertyFailure = createAction(
  '[Properties] Delete Property Failure',
  props<{ error: string }>()
);
