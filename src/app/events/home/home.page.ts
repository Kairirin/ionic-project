import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NavController, IonRouterLink, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { EventsService } from '../services/events.service';
import { MyEvent } from '../interfaces/my-event';
import { EventCardPage } from '../event-card/event-card.page';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [FormsModule, RouterLink, IonRouterLink, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon, IonList, EventCardPage, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar]
})
export class HomePage {
  #eventsService = inject(EventsService);
  #navController = inject(NavController);
  #destroyRef = inject(DestroyRef);

  loadMore = true;
  page = 1;
  search = '';

  events = signal<MyEvent[]>([]); //TODO: Modificar cuando implemente filtros
  order = signal('distance');

  //TODO: Poner skeleton para mientras carga

/*   constructor() { 
    this.reloadEvents();
  } */

  ionViewWillEnter() {
    this.reloadEvents();
  }

  reloadEvents(refresher?: IonRefresher) {
    this.page = 1; //TODO: No hace bien la búsqueda ni la carga de eventos después de buscar

    this.#eventsService
    .getEvents(this.search, this.order(), this.page)
    .subscribe((resp) => {
      this.events.set(resp.events);
      this.loadMore = resp.more;

      refresher?.complete();
    });
  }

  loadMoreEvents(infinite?: IonInfiniteScroll) {
    this.page++;
    this.#eventsService.getEvents(this.search, this.order(), this.page)
      .subscribe({
        next: (resp) => {
          this.events.update((events) => [...events, ...resp.events]);
          infinite?.complete();
          console.log(this.loadMore); //TODO: Borrar
          this.loadMore = resp.more;
        },
        error: (error) => console.log(error)
      })
  }

  deleteEvent(ev: MyEvent) {
    this.events.update((events) => events.filter((e) => e !== ev));
  }
}
