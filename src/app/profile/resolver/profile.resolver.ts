import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { UsersService } from '../services/users.service';
import { User } from 'src/app/auth/interfaces/user';

export const profileResolver: ResolveFn<User> = (route) => {
  const usersService = inject(UsersService);
  const router = inject(Router);
  
  return usersService.getProfile(+route.params['id']).pipe(
    catchError(() => {
      router.navigate(['/events']);
      return EMPTY;
    })
  );
};
