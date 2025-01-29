import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonRouterLink, ToastController, NavController, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonIcon, IonImg, IonButton, IonGrid, IonRow, IonCol, IonLabel } from '@ionic/angular/standalone';
import { User } from '../interfaces/user';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ValueEqualsDirective } from 'src/app/shared/directives/value-equals.directive';
import { AuthService } from '../services/auth.service';
import { Geolocation } from '@capacitor/geolocation';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [ ReactiveFormsModule, RouterLink, IonRouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonIcon, IonImg, IonButton, IonGrid, IonRow, IonCol, IonLabel, ValueEqualsDirective],
})
export class RegisterPage {
  #authService = inject(AuthService);
  #toastCtrl = inject(ToastController);
  #nav = inject(NavController);
  #changeDetector = inject(ChangeDetectorRef);
  
  coords = signal<[number, number]>([0, 0]); //TODO: En principio esto no me hace falta
  
  newUser: User = {
    name: "",
    email: "",
    password: "",
    avatar: "",
    lat: 0,
    lng: 0,
  }

  registerForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)]
    }),
    password2: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  })

  constructor() {
    this.getLocation();
  }

  async getLocation() {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true
    });

    this.newUser.lat = coordinates.coords.latitude;
    this.newUser.lng = coordinates.coords.longitude;

/*     this.coords.set([coordinates.coords.longitude, coordinates.coords.latitude]) */
  }

  register() {
    this.newUser.name = this.registerForm.get('name')?.getRawValue();
    this.newUser.email = this.registerForm.get('email')?.getRawValue();
    this.newUser.password = this.registerForm.get('password')?.getRawValue();

    console.log(this.newUser); //TODO: Comprobar que lo manda bien
    this.#authService.register(this.newUser).subscribe(
      async () => {
        (await this.#toastCtrl.create({
          duration: 3000,
          position: 'bottom',
          message: 'User registered!'
        })).present();
        this.#nav.navigateRoot(['/auth/login']);
      }
    );
  }

  async takePhoto() {;
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      quality: 90,
      height: 200,
      width: 200,
      allowEditing: true,
      resultType: CameraResultType.DataUrl
    });

    this.newUser.avatar = photo.dataUrl as string;
    this.#changeDetector.markForCheck();
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 200,
      width: 200,
      allowEditing: true, //TODO: Comprobar que permita mandar foto
      resultType: CameraResultType.DataUrl
    });

    this.newUser.avatar = photo.dataUrl as string;
    this.#changeDetector.markForCheck();
  }
}

