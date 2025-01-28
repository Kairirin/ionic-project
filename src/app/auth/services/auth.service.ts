import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Observable, catchError, from, map, of, switchMap } from 'rxjs';
import { User, UserLogin } from '../interfaces/user';
import { SingleUserResponse, TokenResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #logged = signal(false);
  #http = inject(HttpClient);
  #authUrl = 'auth';

  get logged() {
    return this.#logged.asReadonly();
  }

  login(user: UserLogin, firebaseToken?: string): Observable<void> {
    return this.#http
      .post<TokenResponse>(`${this.#authUrl}/login`, { ...user, firebaseToken })
      .pipe(
        switchMap(async (r) => {
          try {
            await Preferences.set({ key: 'fs-token', value: r.accessToken });
            this.#logged.set(true);
          } catch (e) {
            throw new Error('Can\'t save authentication token in storage!');
          }
        })
      );
  }

  register(user: User): Observable<void> {
    return this.#http.post<void>('auth/register', user);
  }

  async logout(): Promise<void> {
    await Preferences.remove({ key: 'fs-token' });
    this.#logged.set(false);
  }

  isLogged(): Observable<boolean> {
    if (this.#logged()) {
      return of(true);
    }
    return from(Preferences.get({ key: 'fs-token' })).pipe(
      switchMap((token) => {
        if (!token.value) {
          return of(false);
        }

        return this.#http.get('auth/validate').pipe(
          map(() => {
            this.#logged.set(true); //TODO: Comprobar que está bien los logged
            return true; 
          }),
          catchError(() => of(false)) 
        );
      }),
    );
  }
}
