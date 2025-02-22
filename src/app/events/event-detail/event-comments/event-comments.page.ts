import { Component, computed, DestroyRef, effect, inject, input, numberAttribute, viewChild } from '@angular/core';
import { AlertController, Platform, IonContent, IonHeader, IonToolbar, IonList, IonListHeader, IonItem, IonAvatar, IonLabel, IonRefresher, IonRefresherContent, IonButton, IonImg  } from '@ionic/angular/standalone';
import { EventsService } from '../../services/events.service';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewComment } from '../../interfaces/my-event';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'event-comments',
  templateUrl: './event-comments.page.html',
  styleUrls: ['./event-comments.page.scss'],
  standalone: true,
  imports: [FormsModule, IonContent, IonHeader, IonToolbar, IonList, IonListHeader, IonItem, IonAvatar, IonLabel, IonRefresher, IonRefresherContent, IonButton, DatePipe, IonImg, RouterLink]
})
export class EventCommentsPage  {
  #alertCtrl = inject(AlertController);
  #eventsService = inject(EventsService);
  ionRefresher = viewChild.required(IonRefresher);
  #destroyRef = inject(DestroyRef);
  #platform = inject(Platform);

  id = input.required({ transform: numberAttribute });

  commentsResource = rxResource({
    request: () => this.id(),
    loader: ({request: id}) => this.#eventsService.getComments(id)
  });
  comments = computed(() => this.commentsResource.value() ?? []);

  constructor() {
    this.#platform.resume
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.commentsResource.reload());

    effect(() => {
      if(!this.commentsResource.isLoading()) {
        this.ionRefresher().complete();
      }
    });
  }
  
  ionViewWillEnter() { 
    this.commentsResource.reload();
  }

  loadComments(refresher?: IonRefresher) {
    this.commentsResource.reload();
  }

  async addComment() {
    const alert = await this.#alertCtrl.create({
      header: 'New comment',
      inputs: [
        {
          name: 'comment',
          type: 'text',
          placeholder: 'Enter your comment',
        },
      ],
      buttons: [
        {
          role: 'ok',
          text: 'Add',
        },
        {
          role: 'cancel',
          text: 'Cancel',
        },
      ],
    });

    await alert.present();
    const result = await alert.onDidDismiss();

    if (result.role === 'ok' && result.data.values.comment !== "") {
      const newComment: NewComment = {
        comment: result.data.values.comment
      }

      this.#eventsService
        .addComment(this.id(), newComment)
        .subscribe({
          next: (comment) => {
            const com = this.comments();
            this.commentsResource.set([...com!, comment]);
          },
          error: async (error) => {
            (
              await this.#alertCtrl.create({
                header: 'Oops',
                message: 'Something went wrong. Try again later',
                buttons: ['Ok'],
              })
            ).present();
          }
        });
    }
  }
}
