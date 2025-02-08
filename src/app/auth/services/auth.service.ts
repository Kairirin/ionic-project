import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Observable, catchError, from, map, of, switchMap } from 'rxjs';
import { User, UserFacebook, UserGoogle, UserLogin } from '../interfaces/user';
import { TokenResponse } from '../interfaces/responses';
import { PushNotifications } from '@capacitor/push-notifications';

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
    return this.#http.post<void>(`${this.#authUrl}/register`, user);
  }

  async logout(): Promise<void> {
    await Preferences.remove({ key: 'fs-token' });
    PushNotifications.unregister();
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

        return this.#http.get(`${this.#authUrl}/validate`).pipe(
          map(() => {
            this.#logged.set(true);
            return true; 
          }),
          catchError(() => of(false)) 
        );
      }),
    );
  }

  loginGoogle(userGoogle: UserGoogle, firebaseToken?: string) : Observable<void> {
    return this.#http.post<TokenResponse>(`${this.#authUrl}/google`, {...userGoogle, firebaseToken})
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
  
  loginFacebook(userFacebook: UserFacebook, firebaseToken?: string) : Observable<void> {
    return this.#http.post<TokenResponse>(`${this.#authUrl}/facebook`, {...userFacebook, firebaseToken})
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
}
