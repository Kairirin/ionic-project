import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavController, AlertController, IonContent, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { EventDetailPage } from '../event-detail.page';
import { EventsService } from '../../services/events.service';
import { EventCardPage } from '../../event-card/event-card.page';

@Component({
  selector: 'event-info',
  templateUrl: './event-info.page.html',
  styleUrls: ['./event-info.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, FormsModule, EventCardPage]
})
export class EventInfoPage {
  event = inject(EventDetailPage).event;
  #nav = inject(NavController);

  async deleteEvent() {
    this.#nav.navigateBack(['/events']);
  }
}
