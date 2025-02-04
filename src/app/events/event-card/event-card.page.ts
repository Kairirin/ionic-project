import { Component, inject, input, output } from '@angular/core';
import { IonCard, IonCardTitle, IonCardContent, IonCardHeader, IonIcon, IonRouterLink, IonItem, IonLabel, IonAvatar, IonChip, IonBadge, AlertController, ToastController, IonImg, IonButton, IonGrid, IonCol, IonRow, IonCardSubtitle, IonList, ActionSheetController, NavController } from '@ionic/angular/standalone';
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
  imports: [RouterLink, IonRouterLink, IonCard, IonCardTitle, IonCardContent, IonCardHeader, IonIcon, IonItem, IonLabel, IntlCurrencyPipe, DatePipe, IonAvatar, IonChip, IonBadge, IonImg, IonButton, IonGrid, IonCol, IonRow, IonCardSubtitle, IonList ]
})
export class EventCardPage {
  event = input.required<MyEvent>();
  deleted = output<void>();
  #eventsService = inject(EventsService);
  #alertController = inject(AlertController);
  #toastCtrl = inject(ToastController);
  #navCtrl = inject(NavController);
  #actionSheetController = inject(ActionSheetController);

  async showAction() {
    const actionSheet = await this.#actionSheetController.create({
      header: 'To do',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deleteEvent();
          },
        },
        {
          text: 'Edit',
          icon: 'pencil',
          handler: () => {
            this.#navCtrl.navigateRoot(['/events', this.event().id, 'edit']);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async deleteEvent() {
    const alert = await this.#alertController.create({
      header: 'Are you sure?',
      subHeader: 'The event will be removed',
      buttons: ['I want to delete it', 'Cancel'],
    }); //TODO: No sé porqué se muestra dos veces

    await alert.present();

    const result = await alert.onDidDismiss();
    if (result.role !== 'cancel') {
      this.#eventsService.deleteEvent(this.event().id)
      .subscribe({
        next: () => {
          this.deleted.emit();
          this.showToast("The event has been removed!")
          this.#navCtrl.navigateRoot(['/events'])
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
