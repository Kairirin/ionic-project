import { Component, DestroyRef, inject } from '@angular/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Platform, AlertController, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonList, IonRouterLink, IonRow, IonTitle, IonToolbar, NavController, IonLabel } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { Geolocation } from '@capacitor/geolocation';
import { UserFacebook, UserGoogle, UserLogin } from '../interfaces/user';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [ ReactiveFormsModule, RouterLink, IonRouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonLabel]
})
export class LoginPage {
  #authService = inject(AuthService);
  #alertCtrl = inject(AlertController);
  #navCtrl = inject(NavController);
  #destroyRef = inject(DestroyRef);
  #platform = inject(Platform);

  firebaseToken?: string;

  showPass = false;


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

  userLogin: UserLogin = {
    email: '',
    password: '',
    lat: 0,
    lng: 0,
  };

  constructor() {
    this.getLocation();
    
    if (this.#platform.is('capacitor') || this.#platform.is('mobile') || this.#platform.is('android')) {
      PushNotifications.register();
      
      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration', (token: Token) => {
        this.firebaseToken = token.value;
      });
    }
  }

  async getLocation() {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true
    });

    this.userLogin.lat = coordinates.coords.latitude;
    this.userLogin.lng = coordinates.coords.longitude;
  }

  login() {
    this.userLogin.email = this.loginForm.get('email')?.getRawValue();
    this.userLogin.password = this.loginForm.get('password')?.getRawValue();

    this.#authService
      .login(this.userLogin, this.firebaseToken)
      .subscribe({
        next: () => this.#navCtrl.navigateRoot(['/events']),
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

  async loginGoogle() {
    try {
      const resp = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: ['email', 'profile'],
        },
      });
      if(resp.result.responseType === 'online') {
        console.log(resp);
        const userGoogle: UserGoogle = {
          token: resp.result.idToken!,
          lat: this.userLogin.lat,
          lng: this.userLogin.lng,
        };

        this.#authService
          .loginGoogle(userGoogle)
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe({
            next: () => {
              console.log("Check");
              this.#navCtrl.navigateRoot(['/events'])
            },
            error: async () => {
              (
                await this.#alertCtrl.create({
                  header: 'Login error',
                  message: 'Incorrect login',
                  buttons: ['Ok'],
                })
              ).present();
            },
          });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async loginFacebook() {
    const resp = await SocialLogin.login({
      provider: 'facebook',
      options: {
        permissions: ['email'],
      },
    });
    if (resp.result.accessToken) {
      const userFacebook: UserFacebook = {
        token: resp.result.accessToken.token,
        lat: this.userLogin.lat,
        lng: this.userLogin.lng,
      };

      this.#authService
          .loginFacebook(userFacebook)
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe({
            next: () => {
              this.#navCtrl.navigateRoot(['/events'])
            },
            error: async () => {
              (
                await this.#alertCtrl.create({
                  header: 'Login error',
                  message: 'Incorrect login',
                  buttons: ['Ok'],
                })
              ).present();
            },
          });
    }
  }

/*   async alertFireBase(token: string) {
    (
      await this.#alertCtrl.create({
        header: 'Push',
        message: token,
        buttons: ['Ok'],
      })
    ).present();
  } */
}
