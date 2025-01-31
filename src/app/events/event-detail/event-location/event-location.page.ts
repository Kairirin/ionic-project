import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonFabButton, IonIcon, IonLabel, IonItem } from '@ionic/angular/standalone';
import { EventDetailPage } from '../event-detail.page';
import { OlMapDirective } from 'src/app/shared/ol-maps/ol-map.directive';
import { OlMarkerDirective } from 'src/app/shared/ol-maps/ol-marker.directive';

@Component({
  selector: 'event-location',
  templateUrl: './event-location.page.html',
  styleUrls: ['./event-location.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, FormsModule, OlMapDirective, OlMarkerDirective, IonFabButton, IonIcon, IonLabel, IonItem ]
})
export class EventLocationPage {
  event = inject(EventDetailPage).event;
  coordinates = signal<[number, number]>([0, 0]);

  constructor() {
    effect(() => {
      if(this.event()){
        this.coordinates.set([this.event()!.lng, this.event()!.lat])
      }
    })
  }

  startNavigation(){
    console.log("Disponible pronto!"); //TODO: Falta por implementar la navegación
  }

}
