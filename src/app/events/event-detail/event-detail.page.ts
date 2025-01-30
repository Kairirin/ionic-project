import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButtons, IonHeader, IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { EventsService } from '../services/events.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
  standalone: true,
  imports: [ IonBackButton, IonButtons, IonHeader, IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar, RouterLink]
})
export class EventDetailPage {
  #eventsService = inject(EventsService);

  id = input.required({ transform: numberAttribute });

  eventResource = rxResource({
    request: () => this.id(),
    loader: ({request: id}) => this.#eventsService.getEvent(id)
  });
  event = computed(() => this.eventResource.value());

}
