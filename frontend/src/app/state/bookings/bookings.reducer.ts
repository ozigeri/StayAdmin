import { createReducer, on } from '@ngrx/store';
import { Booking, EBookingStatus } from '../../core/models';
import * as BookingsActions from './bookings.actions';

export interface BookingsState {
  list: Booking[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

export const initialBookingsState: BookingsState = {
  list: [],
  loading: false,
  actionLoading: false,
  error: null,
};

export const bookingsReducer = createReducer(
  initialBookingsState,
  on(BookingsActions.loadBookings, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(BookingsActions.loadBookingsSuccess, (state, { bookings }) => ({
    ...state,
    list: bookings,
    loading: false,
    error: null,
  })),
  on(BookingsActions.loadBookingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(BookingsActions.confirmBooking, BookingsActions.cancelBooking, (state) => ({
    ...state,
    actionLoading: true,
    error: null,
  })),
  on(BookingsActions.confirmBookingSuccess, (state, { id }) => ({
    ...state,
    list: state.list.map((b) =>
      b.id === id ? { ...b, status: EBookingStatus.Confirmed } : b
    ),
    actionLoading: false,
    error: null,
  })),
  on(BookingsActions.cancelBookingSuccess, (state, { id }) => ({
    ...state,
    list: state.list.map((b) =>
      b.id === id ? { ...b, status: EBookingStatus.Cancelled } : b
    ),
    actionLoading: false,
    error: null,
  })),
  on(
    BookingsActions.confirmBookingFailure,
    BookingsActions.cancelBookingFailure,
    (state, { error }) => ({
      ...state,
      actionLoading: false,
      error,
    })
  )
);
