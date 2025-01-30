import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'event-attend',
  templateUrl: './event-attend.page.html',
  styleUrls: ['./event-attend.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EventAttendPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
