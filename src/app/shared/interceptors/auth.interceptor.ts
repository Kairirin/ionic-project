import { HttpInterceptorFn } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return from(Preferences.get({ key: 'fs-token' })).pipe(
    switchMap((token) => {
      if (!token.value) {
        return next(req);
      }

      const authReq = req.clone({
        headers: req.headers.set('Authorization', `bearer ${token.value}`),
      });

      return next(authReq);
    })
  );
};
