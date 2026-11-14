import { createAction, props } from '@ngrx/store';
import { Booking } from '../../core/models';

export const loadBookings = createAction(
  '[Bookings] Load Bookings',
  props<{ status?: string }>()
);

export const loadBookingsSuccess = createAction(
  '[Bookings] Load Bookings Success',
  props<{ bookings: Booking[] }>()
);

export const loadBookingsFailure = createAction(
  '[Bookings] Load Bookings Failure',
  props<{ error: string }>()
);

export const confirmBooking = createAction(
  '[Bookings] Confirm Booking',
  props<{ id: string }>()
);

export const confirmBookingSuccess = createAction(
  '[Bookings] Confirm Booking Success',
  props<{ id: string }>()
);

export const confirmBookingFailure = createAction(
  '[Bookings] Confirm Booking Failure',
  props<{ error: string }>()
);

export const cancelBooking = createAction(
  '[Bookings] Cancel Booking',
  props<{ id: string }>()
);

export const cancelBookingSuccess = createAction(
  '[Bookings] Cancel Booking Success',
  props<{ id: string }>()
);

export const cancelBookingFailure = createAction(
  '[Bookings] Cancel Booking Failure',
  props<{ error: string }>()
);
