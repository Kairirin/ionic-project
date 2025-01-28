import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SingleUserResponse, AvatarResponse } from 'src/app/auth/interfaces/responses';
import { User, UserPhotoEdit, UserProfileEdit, UserPasswordEdit } from 'src/app/auth/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  #usersUrl = 'users';
  #http = inject(HttpClient);

  getProfile(id?: number): Observable<User> {
    if(id){
      return this.#http.get<SingleUserResponse>(`${this.#usersUrl}/${id}`)
        .pipe(map((resp)=> resp.user));
    }
    return this.#http.get<SingleUserResponse>(`${this.#usersUrl}/me`)
        .pipe(map((resp)=> resp.user));
  }

  saveAvatar(avatar: UserPhotoEdit): Observable<string> {
    return this.#http.put<AvatarResponse>(`${this.#usersUrl}/me/photo`, avatar)
    .pipe(map((resp)=> resp.avatar));
  }

  saveProfile(profile: UserProfileEdit): Observable<void> {
    return this.#http.put<void>(`${this.#usersUrl}/me`, profile);
  }

  savePassword(password: UserPasswordEdit): Observable<void> {
    return this.#http.put<void>(`${this.#usersUrl}/me/password`, password);
  } 
}
