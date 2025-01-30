import { ChangeDetectorRef, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { NavController, ToastController, ModalController, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonIcon, IonLabel, IonButton, IonImg, IonGrid, IonRow, IonCol, IonTextarea, IonInput } from '@ionic/angular/standalone';
import { EventsService } from '../services/events.service';
import { minDateValidator } from 'src/app/shared/validators/min-date.validator';
import { MyEventInsert } from '../interfaces/my-event';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { RouterLink } from '@angular/router';
import { ModalContentComponent } from './modal-content/modal-content.component';

@Component({
  selector: 'new-event',
  templateUrl: './new-event.page.html',
  styleUrls: ['./new-event.page.scss'],
  standalone: true,
  imports: [ RouterLink, ReactiveFormsModule, IonContent, IonHeader, IonTitle, IonToolbar,  IonList, IonItem, IonIcon, IonLabel, IonButton, IonImg, IonGrid, IonRow, IonCol, IonTextarea, IonInput]
})
export class NewEventPage {
  #eventsService = inject(EventsService);
  #destroyRef = inject(DestroyRef);
  #navCtrl = inject(NavController);
  #toastCtrl = inject(ToastController);
  #changeDetector = inject(ChangeDetectorRef);
  #modalCtrl = inject(ModalController);

/*   event = input.required<MyEvent | null>(); TODO: Editar
 */
  saved = false;

  minDate = new Date().toISOString().slice(0, 10);
  coordinates = signal<[number, number]>([0, 0]); //TODO: Me falta mapa?

  eventForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.pattern('^[a-zA-Z][a-zA-Z ]*$')]
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    price: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)]
    }),
    date: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, minDateValidator(this.minDate)]
    })
  });

  newEvent: MyEventInsert = {
    title: '',
    description: '',
    price: 0,
    date: '',
    lat: 0,
    lng: 0,
    address: '',
    image: ''
  };

/*   address = "";
  imgBase64 = ''; */

  constructor() {

   }

   sendEvent() {
    this.newEvent.title = this.eventForm.get('title')!.getRawValue();
    this.newEvent.description = this.eventForm.get('description')!.getRawValue();
    this.newEvent.date = this.eventForm.get('date')!.getRawValue();
    this.newEvent.price = this.eventForm.get('price')!.getRawValue();

/*     if(this.event()){
      this.#eventsService.editEvent(newEvent, this.event()!.id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.saved = true;
          this.#router.navigate(['/events']);
        },
        error: (error) => this.showModal(error.error.message)
      });
    }
    else { */
      this.#eventsService.addEvent(this.newEvent)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: () => {
            this.saved = true;
            this.#navCtrl.navigateRoot(['/events']);
          },
          error: (error) => {
            async () => {
              (await this.#toastCtrl.create({
                duration: 3000,
                position: 'bottom',
                message: 'Something went wrong. Try again!'
              })).present();
            }
          }
        });
/*     } */
  }

  async takePhoto() {;
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      quality: 90,
      height: 768,
      width: 1024,
      allowEditing: true,
      resultType: CameraResultType.DataUrl 
    });

    this.newEvent.image = photo.dataUrl as string;
    this.#changeDetector.markForCheck();
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 768,
      width: 1024,
      allowEditing: true,
      resultType: CameraResultType.DataUrl 
    });

    this.newEvent.image = photo.dataUrl as string; //TODO: Que al cancelar la foto sea cadena vacía
    this.#changeDetector.markForCheck();
  }

  async openMap() {
    const modal = await this.#modalCtrl.create({
      component: ModalContentComponent
    });
    await modal.present();
    const result = await modal.onDidDismiss();
    if (result.data) {
      this.newEvent.lat = result.data.coordinates.latitude;
      this.newEvent.lng = result.data.coordinates.longitude;
      this.newEvent.address = result.data.address;
      this.#changeDetector.markForCheck();
    }
    else {
      this.newEvent.lat = 0;
      this.newEvent.lng = 0;
      this.newEvent.address = '';
      this.#changeDetector.markForCheck();
    }
  }

  resetPage(){
    this.eventForm.reset();
    this.newEvent = {
      title: '',
      description: '',
      price: 0,
      date: '',
      lat: 0,
      lng: 0,
      address: '',
      image: ''
    };
  }

}

