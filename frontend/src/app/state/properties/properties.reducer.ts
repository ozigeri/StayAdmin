import { createReducer, on } from '@ngrx/store';
import { Property, PropertyListItem } from '../../core/models';
import * as PropertiesActions from './properties.actions';

export interface PropertiesState {
  list: PropertyListItem[];
  selectedProperty: Property | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialPropertiesState: PropertiesState = {
  list: [],
  selectedProperty: null,
  loading: false,
  saving: false,
  error: null,
};

export const propertiesReducer = createReducer(
  initialPropertiesState,
  on(PropertiesActions.loadProperties, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PropertiesActions.loadPropertiesSuccess, (state, { properties }) => ({
    ...state,
    list: properties,
    loading: false,
    error: null,
  })),
  on(PropertiesActions.loadPropertiesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(PropertiesActions.loadPropertyById, (state) => ({
    ...state,
    loading: true,
    selectedProperty: null,
    error: null,
  })),
  on(PropertiesActions.loadPropertyByIdSuccess, (state, { property }) => ({
    ...state,
    selectedProperty: property,
    loading: false,
    error: null,
  })),
  on(PropertiesActions.loadPropertyByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(PropertiesActions.createProperty, PropertiesActions.updateProperty, (state) => ({
    ...state,
    saving: true,
    error: null,
  })),
  on(PropertiesActions.createPropertySuccess, (state, { property }) => ({
    ...state,
    list: [
      ...state.list,
      {
        id: property.id,
        name: property.name,
        location: property.location,
        category: property.category,
        imageUrl: property.imageUrl,
      },
    ],
    saving: false,
    error: null,
  })),
  on(PropertiesActions.updatePropertySuccess, (state, { property }) => ({
    ...state,
    list: state.list.map((p) =>
      p.id === property.id
        ? {
            id: property.id,
            name: property.name,
            location: property.location,
            category: property.category,
            imageUrl: property.imageUrl,
          }
        : p
    ),
    selectedProperty: property,
    saving: false,
    error: null,
  })),
  on(
    PropertiesActions.createPropertyFailure,
    PropertiesActions.updatePropertyFailure,
    (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })
  ),
  on(PropertiesActions.deletePropertySuccess, (state, { id }) => ({
    ...state,
    list: state.list.filter((p) => p.id !== id),
    selectedProperty: state.selectedProperty?.id === id ? null : state.selectedProperty,
    error: null,
  }))
);
