import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { PropertyService } from '../../core/services/property.service';
import { NotificationService } from '../../core/services/notification.service';
import * as OverviewActions from './overview.actions';

@Injectable()
export class OverviewEffects {
  private readonly actions$ = inject(Actions);
  private readonly propertyService = inject(PropertyService);
  private readonly notificationService = inject(NotificationService);

  loadOverview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OverviewActions.loadOverview),
      switchMap(({ propertyId }) =>
        this.propertyService.getPropertyOverview(propertyId).pipe(
          map((overview) =>
            OverviewActions.loadOverviewSuccess({ overview })
          ),
          catchError((err) =>
            of(
              OverviewActions.loadOverviewFailure({
                error: err.error?.message || 'Nem sikerült betölteni az áttekintő adatokat.',
              })
            )
          )
        )
      )
    )
  );

  errorNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OverviewActions.loadOverviewFailure),
        tap(({ error }) => {
          this.notificationService.showError(error);
        })
      ),
    { dispatch: false }
  );
}
