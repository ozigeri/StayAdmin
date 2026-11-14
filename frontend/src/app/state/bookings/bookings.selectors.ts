import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BookingsState } from './bookings.reducer';
import { BookingSummary, EBookingStatus } from '../../core/models';

export const selectBookingsState =
  createFeatureSelector<BookingsState>('bookings');

export const selectBookingsList = createSelector(
  selectBookingsState,
  (state: BookingsState) => state.list
);

export const selectBookingsLoading = createSelector(
  selectBookingsState,
  (state: BookingsState) => state.loading
);

export const selectBookingActionLoading = createSelector(
  selectBookingsState,
  (state: BookingsState) => state.actionLoading
);

export const selectBookingsError = createSelector(
  selectBookingsState,
  (state: BookingsState) => state.error
);

export const selectBookingsSummary = createSelector(
  selectBookingsList,
  (list): BookingSummary => ({
    total: list.length,
    pending: list.filter((b) => b.status === EBookingStatus.Pending).length,
    confirmed: list.filter((b) => b.status === EBookingStatus.Confirmed).length,
    cancelled: list.filter((b) => b.status === EBookingStatus.Cancelled).length,
  })
);
