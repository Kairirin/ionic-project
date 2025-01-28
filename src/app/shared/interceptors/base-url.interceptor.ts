import { HttpInterceptorFn } from "@angular/common/http";
/* import { isDevMode } from '@angular/core'; */

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const serverUrl = 'https://api.fullstackpro.es/svtickets';
  /* const serverUrl = isDevMode() ? 'http://localhost:3000' : 'https://api.fullstackpro.es/assbook'; */
  const reqClone = req.clone({
    url: `${serverUrl}/${req.url}`,
  });
  return next(reqClone);
};