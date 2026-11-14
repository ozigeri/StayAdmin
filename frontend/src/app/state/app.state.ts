import { ActionReducerMap } from '@ngrx/store';
import { AuthState, authReducer } from './auth/auth.reducer';
import { PropertiesState, propertiesReducer } from './properties/properties.reducer';
import { BookingsState, bookingsReducer } from './bookings/bookings.reducer';
import { OverviewState, overviewReducer } from './overview/overview.reducer';
import { AuthEffects } from './auth/auth.effects';
import { PropertiesEffects } from './properties/properties.effects';
import { BookingsEffects } from './bookings/bookings.effects';
import { OverviewEffects } from './overview/overview.effects';

export interface AppState {
  auth: AuthState;
  properties: PropertiesState;
  bookings: BookingsState;
  overview: OverviewState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  properties: propertiesReducer,
  bookings: bookingsReducer,
  overview: overviewReducer,
};

export const effects = [
  AuthEffects,
  PropertiesEffects,
  BookingsEffects,
  OverviewEffects,
];
