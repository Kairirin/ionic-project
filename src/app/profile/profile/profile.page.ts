import { Component, computed, DestroyRef, inject, input, numberAttribute } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonAvatar, IonImg, IonGrid, IonRow, IonCol, IonLabel, IonItem, IonIcon, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { UsersService } from '../services/users.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { User } from 'src/app/auth/interfaces/user';

@Component({
  selector: 'profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, FormsModule, IonAvatar, IonImg, IonGrid, IonRow, IonCol, IonLabel, IonItem, IonIcon, IonTabBar, IonTabButton, IonTabs ]
})
export class ProfilePage  {
  user = input.required<User>();
}
