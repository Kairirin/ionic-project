import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { NavController, IonRouterLink, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon, IonList, IonInput, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { EventsService } from '../services/events.service';
import { MyEvent } from '../interfaces/my-event';
import { toSignal } from "@angular/core/rxjs-interop";
import { EventCardPage } from '../event-card/event-card.page';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';


@Component({
  selector: 'home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, IonRouterLink, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon, IonList, IonInput, EventCardPage, IonInfiniteScroll, IonInfiniteScrollContent]
})
export class HomePage {
  #eventsService = inject(EventsService);
  #navController = inject(NavController);
  #destroyRef = inject(DestroyRef);

  loadMore = true;
  page = 1;
  searchControl = new FormControl('');
  search = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged(),
    ),
    { initialValue: '' }
  );

  events = signal<MyEvent[]>([]); //TODO: Modificar cuando implemente filtros
  order = signal('distance');

  //TODO: Poner skeleton para mientras carga

  constructor() { //TODO: No hace bien la búsqueda ni la carga de eventos
    effect(() => {
      this.#eventsService.getEvents(this.search()!, this.order(), this.page)
      .subscribe({
        next: (resp) => {
          if (this.page === 1)
            this.events.set(resp.events)
          else
            this.events.update((events) => [...events, ...resp.events]);

          this.loadMore = resp.more? true : false;
        },
        error: (error) => console.log(error)
      })
    })
  }

  reloadEvents(refresher?: IonRefresher) {
    this.page = 1;
    this.loadMoreItems();
    refresher?.complete();
  }

  loadMoreItems(infinite?: IonInfiniteScroll) {
    this.#eventsService.getEvents(this.search()!, this.order(), this.page)
      .subscribe({
        next: (resp) => {
          if (this.page === 1)
            this.events.set(resp.events)
          else
            this.events.update((events) => [...events, ...resp.events]);

          this.page++;
          infinite?.complete();
          console.log(this.loadMore);

          if(!resp.more){
            this.loadMore = false;
          }
        },
        error: (error) => console.log(error)
      })
  }

  deleteEvent(ev: MyEvent) {
    this.events.update((events) => events.filter((e) => e !== ev));
  }

}
