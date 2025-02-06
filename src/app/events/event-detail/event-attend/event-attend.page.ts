import { Component, computed, DestroyRef, effect, inject, viewChild } from '@angular/core';
import { Platform, IonContent, IonHeader, IonToolbar, IonList, IonListHeader, IonItem, IonAvatar, IonLabel, IonRefresher, IonRefresherContent, IonCol, IonIcon, IonButton, IonImg } from '@ionic/angular/standalone';
import { EventsService } from '../../services/events.service';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventDetailPage } from '../event-detail.page';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'event-attend',
  templateUrl: './event-attend.page.html',
  styleUrls: ['./event-attend.page.scss'],
  standalone: true,
  imports: [ IonContent, IonHeader, IonToolbar, IonList,   IonListHeader, IonItem, IonAvatar, IonLabel, IonRefresher, IonRefresherContent, IonCol, IonIcon, IonButton, RouterLink, IonImg ],
})
export class EventAttendPage {
  #eventsService = inject(EventsService);
  ionRefresher = viewChild.required(IonRefresher);
  #destroyRef = inject(DestroyRef);
  #platform = inject(Platform);
  event = inject(EventDetailPage).event;

  attendResource = rxResource({
    request: () => this.event()!.id,
    loader: ({ request: id }) => this.#eventsService.getAttendees(id),
  });

  attendees = computed(() => this.attendResource.value() ?? []);

  constructor() {
    this.#platform.resume
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.attendResource.reload());

    effect(() => {
      if (!this.attendResource.isLoading()) {
        this.ionRefresher().complete();
      }
    });
  }

  loadAttend(refresher?: IonRefresher) {
    this.attendResource.reload();
  }

  attendEvent() {
    const attending = this.event()!.attend;
    const numberAux = this.event()!.numAttend;

    if (!this.event()!.attend) {
      this.event()!.attend = true;
      this.event()!.numAttend++;

      this.#eventsService.postAttend(this.event()!.id)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: () => {
            this.loadAttend();
          },
          error: () => {
            this.event()!.attend = attending;
            this.event()!.numAttend = numberAux;
          },
        });
    }
    else {
      this.event()!.attend = false;
      this.event()!.numAttend--;

      this.#eventsService.deleteAttend(this.event()!.id)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: () => {
            this.loadAttend();
          },
          error: () => {
            this.event()!.attend = attending;
            this.event()!.numAttend = numberAux;
          },
        });
    }
  }
}
