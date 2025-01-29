import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlertController, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonList, IonRouterLink, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { Geolocation } from '@capacitor/geolocation';
import { UserLogin } from '../interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [ ReactiveFormsModule, RouterLink, IonRouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonGrid, IonRow, IonCol, IonButton, IonIcon]
})
export class LoginPage {
  coords = signal<[number, number]>([0, 0]);
  loading = signal(false); //TODO: No sé si al final implementa esto

  #authService = inject(AuthService);
  #alertCtrl = inject(AlertController);
  // #navCtrl = inject(NavController); TODO: Integrar navegación

  loginForm = new FormGroup({ //TODO: Comprobar que esté bien
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {
    this.getLocation();
  }

  async getLocation() {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true
    });

    this.coords.set([coordinates.coords.longitude, coordinates.coords.latitude])
  }

  login() {
    const userLogin: UserLogin = {
      email: this.loginForm.get('email')?.getRawValue(),
      password: this.loginForm.get('password')?.getRawValue(),
      lat: this.coords()[1],
      lng: this.coords()[0],
    };

    this.#authService
      .login(userLogin)
      .subscribe({
        next: () => console.log(userLogin),
        // next: () => this.#navCtrl.navigateRoot(['/products']),
        error: async (error) => {
          (
            await this.#alertCtrl.create({
              header: 'Login error',
              message: 'Incorrect email and/or password',
              buttons: ['Ok'],
            })
          ).present();
        },
      });
  }

  loginGoogle() {} //TODO: No ha dejado instalar el plugin
}
