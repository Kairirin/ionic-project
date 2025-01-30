import { Component, inject, signal } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { ModalController, IonLabel, IonButton, IonContent, IonHeader, IonToolbar, IonButtons, IonIcon} from '@ionic/angular/standalone';
import { Coordinates } from 'src/app/shared/interfaces/coordinates';
import { GaAutocompleteDirective } from 'src/app/shared/ol-maps/ga-autocomplete.directive';
import { OlMapDirective } from 'src/app/shared/ol-maps/ol-map.directive';
import { OlMarkerDirective } from 'src/app/shared/ol-maps/ol-marker.directive';
import { SearchResult } from 'src/app/shared/ol-maps/search-result';

@Component({
  selector: 'modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss'],
  standalone: true,
  imports: [ OlMapDirective, OlMarkerDirective, GaAutocompleteDirective, IonLabel, IonButton, IonContent, IonHeader, IonToolbar, IonButtons, IonIcon]
})
export class ModalContentComponent  {
  #modalCtrl = inject(ModalController);
  coordinates = signal<[number, number]>([0, 0]);
  coords: Coordinates = {
    latitude: 0,
    longitude: 0
  };
  address = '';

  constructor() {
    this.getLocation();
  }

  async getLocation() {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true
    });
    
    this.coordinates.set([coordinates.coords.longitude, coordinates.coords.latitude])
  }

  chooseAddress() {
    this.#modalCtrl.dismiss({ coordinates: this.coords, address: this.address });
  }

  changePlace(result: SearchResult) {
    if(result){
      this.coordinates.set([result.coordinates[0], result.coordinates[1]])
  
      this.coords.latitude = result.coordinates[1];
      this.coords.longitude = result.coordinates[0];
      this.address = result.address;
    }
  }

  close() {
    this.#modalCtrl.dismiss();
  }
}
