import { ChangeDetectorRef, Component, DestroyRef, inject, input, numberAttribute, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NavController, ToastController, ModalController, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonIcon, IonLabel, IonButton, IonImg, IonGrid, IonRow, IonCol, IonTextarea, IonInput, IonMenuButton, IonButtons } from '@ionic/angular/standalone';
import { EventsService } from '../services/events.service';
import { minDateValidator } from 'src/app/shared/validators/min-date.validator';
import { MyEvent, MyEventInsert } from '../interfaces/my-event';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { RouterLink } from '@angular/router';
import { ModalContentComponent } from './modal-content/modal-content.component';

@Component({
  selector: 'new-event',
  templateUrl: './new-event.page.html',
  styleUrls: ['./new-event.page.scss'],
  standalone: true,
  imports: [ RouterLink, ReactiveFormsModule, IonContent, IonHeader, IonTitle, IonToolbar,  IonList, IonItem, IonIcon, IonLabel, IonButton, IonImg, IonGrid, IonRow, IonCol, IonTextarea, IonInput, IonMenuButton, IonButtons ]
})
export class NewEventPage {
  #eventsService = inject(EventsService);
  #destroyRef = inject(DestroyRef);
  #navCtrl = inject(NavController);
  #toastCtrl = inject(ToastController);
  #changeDetector = inject(ChangeDetectorRef);
  #modalCtrl = inject(ModalController);

  id = input.required({ transform: numberAttribute });
  address = "";
  imgBase64 = '';

  saved = false;

  minDate = new Date().toISOString().slice(0, 10);
  coordinates = signal<[number, number]>([0, 0]);

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

   ionViewWillEnter() {
      if(this.id()){
        this.#eventsService.getEvent(this.id())
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe({
            next: (resp) => {
              this.eventForm.get('title')!.setValue(resp.title);
              this.eventForm.get('description')!.setValue(resp.description);
              this.eventForm.get('price')!.setValue(resp.price);
              this.eventForm.get('date')!.setValue(resp.date.split(" ")[0]);
              this.imgBase64 = resp.image;
              this.address = resp.address;
              this.coordinates.set([resp.lng, resp.lat]);
              this.eventForm.markAllAsTouched();
            }
          });
      } else {
        this.eventForm.reset();
      }
  }
   sendEvent() {
    const newEvent: MyEventInsert = {
      title: this.eventForm.get('title')!.getRawValue(),
      description: this.eventForm.get('description')!.getRawValue(),
      price: this.eventForm.get('price')!.getRawValue(),
      date: this.eventForm.get('date')!.getRawValue(),
      lat: this.coordinates()[1],
      lng: this.coordinates()[0],
      address: this.address,
      image: this.imgBase64
    };

    if(this.id()){
      this.#eventsService.editEvent(newEvent, this.id())
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
    }
    else {
      this.#eventsService.addEvent(newEvent)
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
    }
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

    this.imgBase64 = photo.dataUrl as string;
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

    this.imgBase64 = photo.dataUrl as string;
    this.#changeDetector.markForCheck();
  }

  async openMap() {
    const modal = await this.#modalCtrl.create({
      component: ModalContentComponent
    });
    await modal.present();
    const result = await modal.onDidDismiss();
    if (result.data) {
      this.coordinates.set([result.data.coordinates.longitude, result.data.coordinates.latitude]);
      this.address = result.data.address;
      this.#changeDetector.markForCheck();
    }
    else {
      this.coordinates.set([ 0, 0]);
      this.address = '';
      this.#changeDetector.markForCheck();
    }
  }
}

