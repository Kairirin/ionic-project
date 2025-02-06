import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform, IonApp, IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonRouterLink, IonRouterOutlet, IonSplitPane, IonAvatar, IonImg, IonButton, NavController, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { User } from './auth/interfaces/user';
import { home, logIn, documentText, checkmarkCircle, images, camera, arrowUndoCircle, planet, eye, eyeOff, exit, add, trash, pencil, ellipsisHorizontal, people, search, compass, close, informationCircle, chatboxEllipses, navigate, thumbsUp, thumbsDown, person, logoGoogle, logoFacebook, map, card, golf, colorWand } from 'ionicons/icons';
import { ActionPerformed, PushNotificationSchema, PushNotifications } from '@capacitor/push-notifications';
import { UsersService } from './profile/services/users.service';
import { AuthService } from './auth/services/auth.service';
import { SocialLogin } from '@capgo/capacitor-social-login';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonRouterLink, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonAvatar, IonImg, IonButton],
})
export class AppComponent {
  user = signal<User | null>(null); //TODO: No se actualiza la foto al cambiarla en el perfil
  #userService = inject(UsersService);
  #authService = inject(AuthService);
  #platform = inject(Platform);
  #nav = inject(NavController);
  #toast = inject(ToastController);

  public appPages = [{ title: 'Events', url: '/events', icon: 'planet' },
    { title: 'New event', url: '/events/add', icon: 'add'},
    { title: 'My profile', url: 'profile/me', icon: 'person'}
  ];

  constructor() {
    addIcons({ planet, home, logIn, documentText, checkmarkCircle, images, camera, arrowUndoCircle, eye, eyeOff, exit, add, trash, pencil, ellipsisHorizontal, people, search, compass, close, informationCircle, chatboxEllipses, navigate, thumbsUp, thumbsDown, person, logoGoogle, logoFacebook, map, card, golf, colorWand });

    effect(() => {
      if (this.#authService.logged()) {
        this.#userService.getProfile().subscribe((user) => (this.user.set(user)));
      } else {
        this.user.set(null);
      }
    });

    this.initializeApp();
  }

  async initializeApp() {
    if (this.#platform.is('mobile') || this.#platform.is('capacitor')) {
      await this.#platform.ready();   
      SplashScreen.hide();
      await SocialLogin.initialize({
        google: {
          webClientId: '746820501392-oalflicqch2kuc12s8rclb5rf7b1fist.apps.googleusercontent.com',
        },
        facebook: {
          appId: '474376018619677',
          clientToken: '04c13f5805fafe10f6be54f55e079882',
        },
      });

      const res = await PushNotifications.checkPermissions();
      if(res.receive !== 'granted') {
        await PushNotifications.requestPermissions();
      }

      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener(
        'pushNotificationReceived',
        async (notification: PushNotificationSchema) => {
          const toast = await this.#toast.create({
            header: notification.title,
            message: notification.body,
            duration: 3000,
          });
          await toast.present();
        }
      );

      // Method called when tapping on a notification
      PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          if (notification.notification.data.eventId) {
            this.#nav.navigateRoot([
              '/events',
              notification.notification.data.eventId,
              'comments',
            ]);
          }
        }
      );
    }
  }

  async logout() {
    await this.#authService.logout();
    this.#nav.navigateRoot(['/auth/login']);
  }
}