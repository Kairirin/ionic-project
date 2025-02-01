import { Routes } from '@angular/router';

export const profileDetailRoutes: Routes = [
  {
    path: 'info',
    loadComponent: () =>
      import('./profile-info/profile-info.page').then(
        (m) => m.ProfileInfoPage
      ),
  },
  {
    path: 'location',
    loadComponent: () =>
      import('./profile-location/profile-location.page').then(
        (m) => m.ProfileLocationPage
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: 'info' },
];