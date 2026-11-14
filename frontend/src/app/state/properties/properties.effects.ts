import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { PropertyService } from '../../core/services/property.service';
import { NotificationService } from '../../core/services/notification.service';
import * as PropertiesActions from './properties.actions';

@Injectable()
export class PropertiesEffects {
  private readonly actions$ = inject(Actions);
  private readonly propertyService = inject(PropertyService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  loadProperties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.loadProperties),
      switchMap(({ name, category }) =>
        this.propertyService.getProperties(name, category).pipe(
          map((properties) =>
            PropertiesActions.loadPropertiesSuccess({ properties })
          ),
          catchError((err) =>
            of(
              PropertiesActions.loadPropertiesFailure({
                error: err.error?.message || 'Nem sikerült betölteni a szálláshelyeket.',
              })
            )
          )
        )
      )
    )
  );

  loadPropertyById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.loadPropertyById),
      switchMap(({ id }) =>
        this.propertyService.getPropertyById(id).pipe(
          map((property) =>
            PropertiesActions.loadPropertyByIdSuccess({ property })
          ),
          catchError((err) =>
            of(
              PropertiesActions.loadPropertyByIdFailure({
                error: err.error?.message || 'Nem sikerült betölteni a szálláshely részleteit.',
              })
            )
          )
        )
      )
    )
  );

  createProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.createProperty),
      switchMap(({ dto }) =>
        this.propertyService.createProperty(dto).pipe(
          map((property) =>
            PropertiesActions.createPropertySuccess({ property })
          ),
          catchError((err) =>
            of(
              PropertiesActions.createPropertyFailure({
                error: err.error?.message || 'Nem sikerült létrehozni a szálláshelyet.',
              })
            )
          )
        )
      )
    )
  );

  createPropertySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PropertiesActions.createPropertySuccess),
        tap(() => {
          this.notificationService.showSuccess('Szálláshely sikeresen létrehozva!');
          this.router.navigate(['/properties']);
        })
      ),
    { dispatch: false }
  );

  updateProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.updateProperty),
      switchMap(({ id, dto }) =>
        this.propertyService.updateProperty(id, dto).pipe(
          map((property) =>
            PropertiesActions.updatePropertySuccess({ property })
          ),
          catchError((err) =>
            of(
              PropertiesActions.updatePropertyFailure({
                error: err.error?.message || 'Nem sikerült módosítani a szálláshelyet.',
              })
            )
          )
        )
      )
    )
  );

  updatePropertySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PropertiesActions.updatePropertySuccess),
        tap(() => {
          this.notificationService.showSuccess('Szálláshely adatai sikeresen módosítva!');
          this.router.navigate(['/properties']);
        })
      ),
    { dispatch: false }
  );

  deleteProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.deleteProperty),
      switchMap(({ id }) =>
        this.propertyService.deleteProperty(id).pipe(
          map(() => PropertiesActions.deletePropertySuccess({ id })),
          catchError((err) =>
            of(
              PropertiesActions.deletePropertyFailure({
                error: err.error?.message || 'Nem sikerült törölni a szálláshelyet.',
              })
            )
          )
        )
      )
    )
  );

  deletePropertySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PropertiesActions.deletePropertySuccess),
        tap(() => {
          this.notificationService.showSuccess('Szálláshely sikeresen törölve!');
        })
      ),
    { dispatch: false }
  );

  errorNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          PropertiesActions.loadPropertiesFailure,
          PropertiesActions.loadPropertyByIdFailure,
          PropertiesActions.createPropertyFailure,
          PropertiesActions.updatePropertyFailure,
          PropertiesActions.deletePropertyFailure
        ),
        tap(({ error }) => {
          this.notificationService.showError(error);
        })
      ),
    { dispatch: false }
  );
}
