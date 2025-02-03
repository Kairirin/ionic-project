import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonLabel,  IonIcon, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { User } from 'src/app/auth/interfaces/user';

@Component({
  selector: 'profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [ IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, FormsModule, IonLabel, IonIcon, IonTabBar, IonTabButton, IonTabs ]
})
export class ProfilePage  {
  user = input.required<User>();
}
