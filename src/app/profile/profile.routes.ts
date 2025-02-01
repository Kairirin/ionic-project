import { Routes } from '@angular/router';
import { profileResolver } from './resolver/profile.resolver';

export const profileRoutes: Routes = [
    {
        path: 'me',
        resolve: {
            user: profileResolver,
          },
        loadComponent: () =>
            import('./profile/profile.page').then((m) => m.ProfilePage),
        loadChildren: () =>
          import('./profile/profile-detail.routes').then((m) => m.profileDetailRoutes),
      },
      {
        path: ':id',
        resolve: {
            user: profileResolver,
          },
        loadComponent: () =>
            import('./profile/profile.page').then((m) => m.ProfilePage),
        loadChildren: () =>
          import('./profile/profile-detail.routes').then((m) => m.profileDetailRoutes),
      },
      { path: '', redirectTo: '/profile/me', pathMatch: 'full' },
];