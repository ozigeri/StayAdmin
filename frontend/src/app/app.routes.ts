import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginViewComponent } from './views/login/login-view.component';
import { OverviewViewComponent } from './views/overview/overview-view.component';
import { PropertiesViewComponent } from './views/properties/properties-view.component';
import { PropertyFormViewComponent } from './views/property-form/property-form-view.component';
import { BookingsViewComponent } from './views/bookings/bookings-view.component';
import { NotFoundViewComponent } from './views/not-found/not-found-view.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginViewComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        component: OverviewViewComponent,
      },
      {
        path: 'properties',
        component: PropertiesViewComponent,
      },
      {
        path: 'properties/new',
        component: PropertyFormViewComponent,
      },
      {
        path: 'properties/:id/edit',
        component: PropertyFormViewComponent,
      },
      {
        path: 'bookings',
        component: BookingsViewComponent,
      },
    ],
  },
  {
    path: '**',
    component: NotFoundViewComponent,
  },
];
