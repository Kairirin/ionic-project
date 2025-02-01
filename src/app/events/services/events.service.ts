import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Comment, MyEvent, MyEventInsert, NewComment } from '../interfaces/my-event';
import { HttpClient } from '@angular/common/http';
import { UsersResponse } from 'src/app/auth/interfaces/responses';
import { User } from 'src/app/auth/interfaces/user';
import { EventsResponse, SingleEventResponse, CommentsResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  #eventsUrl = 'events';
  #http = inject(HttpClient);

   getEvents(search: string, order: string, page: number, creator?: string): Observable<EventsResponse> {
    let params;
    if (creator)
      params = new URLSearchParams({ page: String(page), order, search, creator });
    else 
      params = new URLSearchParams({ page: String(page), order, search });
    
    return this.#http.get<EventsResponse>(`${this.#eventsUrl}?${params.toString()}`)
      .pipe(map((resp) => resp));
  }

  getEventsAttending(search: string, order: string, page: number, attending: string): Observable<EventsResponse> {
    const params = new URLSearchParams({ page: String(page), order, search });
    
    return this.#http.get<EventsResponse>(`${this.#eventsUrl}?${params.toString()}&attending=${attending}`)
    .pipe(map((resp) => resp));
  }

   getEvent(id: number): Observable<MyEvent> {
    return this.#http.get<SingleEventResponse>(`${this.#eventsUrl}/${id}`)
      .pipe(map((resp) => resp.event));
  }

  addEvent(event: MyEventInsert): Observable<MyEvent> { 
    return this.#http.post<SingleEventResponse>(this.#eventsUrl, event)
      .pipe(map((resp) => resp.event));
  }

  editEvent(event: MyEventInsert, id: number): Observable<MyEvent>{
    return this.#http.put<SingleEventResponse>(`${this.#eventsUrl}/${id}`, event)
      .pipe(map((resp) => resp.event));
  }

  deleteEvent(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.#eventsUrl}/${id}`);
  }

  getAttendees(id: number): Observable<User[]> {
    return this.#http.get<UsersResponse>(`${this.#eventsUrl}/${id}/attend`)
      .pipe(map((resp) => resp.users));
  }

  postAttend(id: number): Observable<void> {
    return this.#http.post<void>(`${this.#eventsUrl}/${id}/attend`, null);
  }

  deleteAttend(id: number): Observable<void> { 
    return this.#http.delete<void>(`${this.#eventsUrl}/${id}/attend`);
  }

  addComment(id: number, comment: NewComment): Observable<Comment> {
    return this.#http.post<Comment>(`${this.#eventsUrl}/${id}/comments`, comment).pipe(map((resp) => resp));
  }

  getComments(id:number): Observable<Comment[]> {
    return this.#http.get<CommentsResponse>(`${this.#eventsUrl}/${id}/comments`)
    .pipe(map((resp) => resp.comments));
  }
}