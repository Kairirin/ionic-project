import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './app/shared/interceptors/base-url.interceptor';
import { authInterceptor } from './app/shared/interceptors/auth.interceptor';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

defineCustomElements(window);

bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules), withRouterConfig({paramsInheritanceStrategy: 'always'})),
    provideHttpClient(withInterceptors([baseUrlInterceptor, authInterceptor])),
  ],
});
