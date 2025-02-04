import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform, IonApp, IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonRouterLink, IonRouterOutlet, IonSplitPane, IonAvatar, IonImg, IonButton, NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { User } from './auth/interfaces/user';
import { home, logIn, documentText, checkmarkCircle, images, camera, arrowUndoCircle, planet, eye, eyeOff, exit, add, trash, pencil, ellipsisHorizontal, people, search, compass, close, informationCircle, chatboxEllipses, navigate, thumbsUp, thumbsDown, person, logoGoogle, logoFacebook, map, card, golf, colorWand } from 'ionicons/icons';
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
    if (this.#platform.is('capacitor')) {
      await this.#platform.ready();   
      SplashScreen.hide();
      await SocialLogin.initialize({
        google: {
          webClientId: '746820501392-oalflicqch2kuc12s8rclb5rf7b1fist.apps.googleusercontent.com', //MI ID: 1161264609-p0pct0u7g1b72j2riaqp1mlh284l4smk.apps.googleusercontent.com
          //ID Arturo: 746820501392-oalflicqch2kuc12s8rclb5rf7b1fist.apps.googleusercontent.com
        },
        facebook: {
          appId: '474376018619677',
          clientToken: '04c13f5805fafe10f6be54f55e079882',
        },
      });
    }
  }

  async logout() {
    await this.#authService.logout();
    this.#nav.navigateRoot(['/auth/login']);
  }
}