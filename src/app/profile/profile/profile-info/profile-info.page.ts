import { ChangeDetectorRef, Component, DestroyRef, inject, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonGrid, IonCol, IonRow, IonItem, IonLabel, IonImg, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ProfilePage } from '../profile.page';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UsersService } from '../../services/users.service';
import { UserPhotoEdit } from 'src/app/auth/interfaces/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'profile-info',
  templateUrl: './profile-info.page.html',
  styleUrls: ['./profile-info.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, FormsModule, IonGrid, IonCol, IonRow, IonItem, IonLabel, IonImg, IonButton, IonIcon ]
})
export class ProfileInfoPage {
  user = inject(ProfilePage).user;
  #userService = inject(UsersService);
  #changeDetector = inject(ChangeDetectorRef);
  #destroyRef = inject(DestroyRef);
  editProfile = signal(false);
  editPassword = signal(false);

  updateProfile() {

  }

  updatePassword(){

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
