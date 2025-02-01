import { Component, effect, inject, signal } from '@angular/core';
import { IonContent, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { ProfilePage } from '../profile.page';
import { OlMapDirective } from 'src/app/shared/ol-maps/ol-map.directive';
import { OlMarkerDirective } from 'src/app/shared/ol-maps/ol-marker.directive';

@Component({
  selector: 'profile-location',
  templateUrl: './profile-location.page.html',
  styleUrls: ['./profile-location.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader,  IonToolbar, OlMapDirective, OlMarkerDirective]
})
export class ProfileLocationPage {
  user = inject(ProfilePage).user;
  coordinates = signal<[number, number]>([0, 0]);

  constructor() {
    effect(() => {
      if(this.user()){
        this.coordinates.set([this.user()!.lng, this.user()!.lat])
      }
    })
  }
}
