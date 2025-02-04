import { Routes } from '@angular/router';

export const eventsRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./home/home.page').then(
                (m) => m.HomePage
            ),
    },
    {
        path: 'add',
        loadComponent: () =>
            import('./new-event/new-event.page').then(
                (m) => m.NewEventPage
            ),
    },
    {
      path: ':id/edit',
      loadComponent: () =>
          import('./new-event/new-event.page').then((m) => m.NewEventPage),
    },
    {
        path: ':id',
        loadComponent: () =>
          import('./event-detail/event-detail.page').then(
            (m) => m.EventDetailPage
          ),
        loadChildren: () =>
          import('./event-detail/event-detail.routes').then((m) => m.eventDetailRoutes),
      },
      { path: 'edit', redirectTo: '/events/add', pathMatch: 'full' }
];