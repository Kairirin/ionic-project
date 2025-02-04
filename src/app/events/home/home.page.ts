import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { IonRouterLink, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar, AlertController, IonButton, IonCol, IonRow, IonGrid } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { EventsService } from '../services/events.service';
import { MyEvent } from '../interfaces/my-event';
import { EventCardPage } from '../event-card/event-card.page';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [FormsModule, RouterLink, IonRouterLink, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon, IonList, EventCardPage, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar, IonButton, IonCol, IonRow, IonGrid ]
})
export class HomePage {
  #eventsService = inject(EventsService);
  #alertController = inject(AlertController);
  #destroyRef = inject(DestroyRef);

  loadMore = true;
  page = 1;
  search = '';

  events = signal<MyEvent[]>([]);
  order = signal('distance');
  creator = input<string>('');
  attending = input<string>('');

  ionViewWillEnter() {
    if (this.attending()){
      this.getEventsByAttending();
    } else {
      this.reloadEvents();
    }
  }

  async showFilters() {
    const alert = await this.#alertController.create({
      header: 'Choose order by',
      inputs: [
        {
          label: 'Distance',
          type: 'radio',
          value: 'distance'
        },
        {
          label: 'Price',
          type: 'radio',
          value: 'price'
        },
        {
          label: 'Date',
          type: 'radio',
          value: 'date'
        }
      ],
      buttons: ['Filter', 'Cancel'],
    });

    await alert.present();

    const result = await alert.onDidDismiss();
    if (result.data && result.role !== 'cancel') {
      this.order.set(result.data.values);
      this.reloadEvents();
    }
  }

  reloadEvents(refresher?: IonRefresher) {
    this.page = 1; //TODO: No hace bien la búsqueda ni la carga de eventos después de buscar

    this.#eventsService
    .getEvents(this.search, this.order(), this.page, this.creator())
    .pipe(takeUntilDestroyed(this.#destroyRef))
    .subscribe((resp) => {
      this.events.set(resp.events);
      this.loadMore = resp.more;

      refresher?.complete();
    });
  }

  loadMoreEvents(infinite?: IonInfiniteScroll) {
    this.page++;

    if (this.attending()){
      this.#eventsService.getEventsAttending(this.search, this.order(), this.page, this.attending())
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (resp) => {
          this.events.update((events) => [...events, ...resp.events]);
          infinite?.complete();
          this.loadMore = resp.more;
        },
        error: (error) => console.log(error)
      })
    } else {
      this.#eventsService.getEvents(this.search, this.order(), this.page, this.creator())
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: (resp) => {
            this.events.update((events) => [...events, ...resp.events]);
            infinite?.complete();
            this.loadMore = resp.more;
          },
          error: (error) => console.log(error)
        })
    }
  }

  deleteEvent(ev: MyEvent) {
    this.events.update((events) => events.filter((e) => e !== ev));
  }

  getEventsByAttending() {
    this.#eventsService
      .getEventsAttending(this.search, this.order(), this.page, this.attending())
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((resp) => {
        this.events.set(resp.events)
      });
  }
}
