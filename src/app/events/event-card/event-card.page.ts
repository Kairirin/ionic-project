import { Component, inject, input, output } from '@angular/core';
import { IonCard, IonCardTitle, IonCardContent, IonCardHeader, IonFab, IonFabButton, IonIcon, IonRouterLink, IonItem, IonFabList, IonLabel, IonAvatar, IonChip, IonBadge, AlertController, ToastController, IonImg } from '@ionic/angular/standalone';
import { MyEvent } from '../interfaces/my-event';
import { RouterLink } from '@angular/router';
import { IntlCurrencyPipe } from 'src/app/shared/pipes/intl-currency.pipe';
import { DatePipe } from '@angular/common';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'event-card',
  templateUrl: './event-card.page.html',
  styleUrls: ['./event-card.page.scss'],
  standalone: true,
  imports: [RouterLink, IonRouterLink, IonCard, IonCardTitle, IonCardContent, IonCardHeader, IonFab, IonFabButton, IonIcon, IonItem, IonFabList, IonLabel, IntlCurrencyPipe, DatePipe, IonAvatar, IonChip, IonBadge, IonImg ]
})
export class EventCardPage {
  event = input.required<MyEvent>();
  deleted = output<void>();
  #eventsService = inject(EventsService);
  #alertController = inject(AlertController);
  #toastCtrl = inject(ToastController)

  async deleteEvent() {
    const alert = await this.#alertController.create({
      header: 'Are you sure?',
      subHeader: 'The event will be removed',
      buttons: ['I want to delete it', 'Cancel'],
    });

    await alert.present();

    const result = await alert.onDidDismiss();
    if (result.role !== 'cancel') {
      this.#eventsService.deleteEvent(this.event().id)
      .subscribe({
        next: () => {
          this.deleted.emit();
          this.showToast("The event has been removed!")
        },
        error: () => this.showToast("The event could not be removed at this moment")
      })
    }
  }

  async showToast(message: string) {
    const toast = await this.#toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'bottom',
      color: 'danger',
      buttons: [
        {
          icon: 'close-circle',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

}
