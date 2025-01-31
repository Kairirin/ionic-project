import { Component, computed, DestroyRef, effect, inject, input, numberAttribute, viewChild } from '@angular/core';
import { AlertController, Platform, IonContent, IonHeader, IonToolbar, IonList, IonListHeader, IonItem, IonAvatar, IonLabel, IonRefresher, IonRefresherContent, IonCol, IonIcon, IonButton,  } from '@ionic/angular/standalone';
import { EventsService } from '../../services/events.service';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventDetailPage } from '../event-detail.page';

@Component({
  selector: 'event-comments',
  templateUrl: './event-comments.page.html',
  styleUrls: ['./event-comments.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonList, IonListHeader, IonItem, IonAvatar, IonLabel, IonRefresher, IonRefresherContent, IonCol, IonIcon, IonButton]
})
export class EventCommentsPage  {
  #alertCtrl = inject(AlertController);
  #eventsService = inject(EventsService);
  ionRefresher = viewChild.required(IonRefresher);
  #platform = inject(Platform); //TODO: Esto es para las push realmente
  #destroyRef = inject(DestroyRef);

  id = input.required({ transform: numberAttribute });

  commentsResource = rxResource({
    request: () => this.id(),
    loader: ({request: id}) => this.#eventsService.getComments(id)
  });
  comments = computed(() => this.commentsResource.value() ?? []);

  constructor() {
    this.#platform.resume.pipe(takeUntilDestroyed()).subscribe(
      () => this.commentsResource.reload() // Recargamos comentarios cuando la aplicación se reactiva (resume)
    );

    effect(() => {
      if(!this.commentsResource.isLoading()) {
        this.ionRefresher().complete(); // Si estaba la animación de carga, una vez tenemos comentarios cargados, se cancela
      }
    });
  }

  loadComments(refresher?: IonRefresher) {
    this.commentsResource.reload();
  }

  async addComment() {
    const alert = await this.#alertCtrl.create({
      header: 'New commment',
      inputs: [
        {
          name: 'comment',
          type: 'text',
          placeholder: 'Enter your comment',
        },
      ],
      buttons: [
        {
          text: 'Add',
          role: 'ok',
        },
        {
          role: 'cancel',
          text: 'Cancel',
        },
      ],
    });

    await alert.present();
    const result = await alert.onDidDismiss();

    if (result.role === 'ok') {
      this.#eventsService
        .addComment(this.id(), result.data.values.comment)
        .subscribe((comment) => this.commentsResource.update(comments => [...comments!, comment]));
    }
  }
}
