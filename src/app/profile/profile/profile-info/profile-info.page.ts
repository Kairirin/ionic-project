import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonGrid, IonCol, IonRow, IonItem, IonLabel, IonImg, IonButton, IonIcon, ModalController, ActionSheetController, NavController, ToastController } from '@ionic/angular/standalone';
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
  imports: [ IonContent, IonHeader, IonToolbar, FormsModule, IonGrid, IonCol, IonRow, IonItem, IonLabel, IonImg, IonButton, IonIcon, ReactiveFormsModule ],
})
export class ProfileInfoPage {
  #userService = inject(UsersService);
  #changeDetector = inject(ChangeDetectorRef);
  #actionSheetController = inject(ActionSheetController);
  #modalCtrl = inject(ModalController);
  #navCtrl = inject(NavController);
  #toastCtrl = inject(ToastController);
  #destroyRef = inject(DestroyRef);

  user = inject(ProfilePage).user;

  async showAction() {
    const actionSheet = await this.#actionSheetController.create({
      header: 'About this user',
      buttons: [
        {
          text: 'Events created',
          icon: 'color-wand',
          handler: () => {
            this.#navCtrl.navigateRoot(['/events', { creator: this.user().id },]);
          },
        },
        {
          text: 'Events attending',
          icon: 'golf',
          handler: () => {
            this.#navCtrl.navigateRoot(['/events', { attending: this.user().id },]);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async openModal(type: string) {
    if (type === 'profile') {
      const modal = await this.#modalCtrl.create({
        component: ModalContentComponent,
        componentProps: {
          title: type,
          username: this.user().name,
          userEmail: this.user().email,
          profile: true,
        },
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

  async takePhoto() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      quality: 90,
      height: 200,
      width: 200,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
    });

    this.saveAvatar(photo.dataUrl as string);
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 200,
      width: 200,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
    });

    this.saveAvatar(photo.dataUrl as string);
  }

  saveAvatar(avatar: string) {
    const newAvatar: UserPhotoEdit = {
      avatar: avatar,
    };

    this.#userService
      .saveAvatar(newAvatar)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (result) => {
          this.user().avatar = result;
          this.#changeDetector.markForCheck();
          this.showToast("Avatar updated", "success");
        },
        error: () => this.showToast("Avatar's updating failed. Try again", "danger"),
      });
  }

  async showToast(message: string, color: string) {
    const toast = await this.#toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'bottom',
      color: color,
      buttons: [
        {
          icon: 'close-circle',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }
}
