import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { BookingService } from '../../core/services/booking.service';
import { NotificationService } from '../../core/services/notification.service';
import * as BookingsActions from './bookings.actions';

@Injectable()
export class BookingsEffects {
  private readonly actions$ = inject(Actions);
  private readonly bookingService = inject(BookingService);
  private readonly notificationService = inject(NotificationService);

  loadBookings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingsActions.loadBookings),
      switchMap(({ status }) =>
        this.bookingService.getBookings(status).pipe(
          map((bookings) =>
            BookingsActions.loadBookingsSuccess({ bookings })
          ),
          catchError((err) =>
            of(
              BookingsActions.loadBookingsFailure({
                error: err.error?.message || 'Nem sikerült betölteni a foglalásokat.',
              })
            )
          )
        )
      )
    )
  );

  confirmBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingsActions.confirmBooking),
      switchMap(({ id }) =>
        this.bookingService.confirmBooking(id).pipe(
          map(() => BookingsActions.confirmBookingSuccess({ id })),
          catchError((err) =>
            of(
              BookingsActions.confirmBookingFailure({
                error: err.error?.message || 'Nem sikerült visszaigazolni a foglalást.',
              })
            )
          )
        )
      )
    )
  );

  confirmBookingSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BookingsActions.confirmBookingSuccess),
        tap(() => {
          this.notificationService.showSuccess('Foglalás sikeresen visszaigazolva!');
        })
      ),
    { dispatch: false }
  );

  cancelBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingsActions.cancelBooking),
      switchMap(({ id }) =>
        this.bookingService.cancelBooking(id).pipe(
          map(() => BookingsActions.cancelBookingSuccess({ id })),
          catchError((err) =>
            of(
              BookingsActions.cancelBookingFailure({
                error: err.error?.message || 'Nem sikerült lemondani a foglalást.',
              })
            )
          )
        )
      )
    )
  );

  cancelBookingSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BookingsActions.cancelBookingSuccess),
        tap(() => {
          this.notificationService.showWarning('Foglalás lemondva!');
        })
      ),
    { dispatch: false }
  );

  errorNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          BookingsActions.loadBookingsFailure,
          BookingsActions.confirmBookingFailure,
          BookingsActions.cancelBookingFailure
        ),
        tap(({ error }) => {
          this.notificationService.showError(error);
        })
      ),
    { dispatch: false }
  );
}
