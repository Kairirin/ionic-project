import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonGrid, IonCol, IonRow, IonItem, IonLabel, IonImg, IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { ProfilePage } from '../profile.page';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UsersService } from '../../services/users.service';
import { UserPhotoEdit } from 'src/app/auth/interfaces/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalContentComponent } from './modal-content/modal-content.component';

@Component({
  selector: 'profile-info',
  templateUrl: './profile-info.page.html',
  styleUrls: ['./profile-info.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, FormsModule, IonGrid, IonCol, IonRow, IonItem, IonLabel, IonImg, IonButton, IonIcon, ReactiveFormsModule ]
})
export class ProfileInfoPage {
  user = inject(ProfilePage).user;
  #changeDetector = inject(ChangeDetectorRef);
  #modalCtrl = inject(ModalController);
  #userService = inject(UsersService);
  #destroyRef = inject(DestroyRef);

  async openModal(type: string){

    if (type === "profile"){
      const modal = await this.#modalCtrl.create({
        component: ModalContentComponent,
        componentProps: { title: type, username: this.user().name, userEmail: this.user().email, profile: true },
      });
      await modal.present();
      const result = await modal.onDidDismiss();
      if (result.data && (result.data.name || result.data.email)) {
        this.user().name = result.data.name;
        this.user().email = result.data.email;
        this.#changeDetector.markForCheck();
      }
    } else {
      const modal = await this.#modalCtrl.create({
        component: ModalContentComponent,
        componentProps: { title: type, password: true },
      });
      await modal.present();
      const result = await modal.onDidDismiss();
      if (result.data && (result.data.name || result.data.email)) {
        this.user().name = result.data.name;
        this.user().email = result.data.email;
        this.#changeDetector.markForCheck();
      }
    }
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

    this.saveAvatar(photo.dataUrl as string);

  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 200,
      width: 200,
      allowEditing: true, //TODO: Comprobar que permita mandar foto
      resultType: CameraResultType.DataUrl
    });

    this.saveAvatar(photo.dataUrl as string);
  }

  saveAvatar(avatar: string) {
    const newAvatar: UserPhotoEdit = {
      avatar: avatar
    }

    this.#userService.saveAvatar(newAvatar)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (result) => {
          this.user().avatar = result;
          this.#changeDetector.markForCheck();
        },
        error: () => {} //TODO: Poner alert
      })
    }
}
