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
];