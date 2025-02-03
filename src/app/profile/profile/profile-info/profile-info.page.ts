import { ChangeDetectorRef, Component, DestroyRef, inject, signal} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonGrid, IonCol, IonRow, IonItem, IonLabel, IonImg, IonButton, IonIcon, IonList, AlertController, ToastController, IonInput, ModalController } from '@ionic/angular/standalone';
import { ProfilePage } from '../profile.page';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UsersService } from '../../services/users.service';
import { UserPasswordEdit, UserPhotoEdit, UserProfileEdit } from 'src/app/auth/interfaces/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ValueEqualsDirective } from 'src/app/shared/directives/value-equals.directive';
import { ModalContentComponent } from './modal-content/modal-content.component';

@Component({
  selector: 'profile-info',
  templateUrl: './profile-info.page.html',
  styleUrls: ['./profile-info.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, FormsModule, IonGrid, IonCol, IonRow, IonItem, IonLabel, IonImg, IonButton, IonIcon, IonList, ReactiveFormsModule, IonInput, ValueEqualsDirective ]
})
export class ProfileInfoPage {
  user = inject(ProfilePage).user;
  #userService = inject(UsersService);
  #changeDetector = inject(ChangeDetectorRef);
  #destroyRef = inject(DestroyRef);
  #alertCtrl = inject(AlertController);
  #toastCtrl = inject(ToastController)
  #modalCtrl = inject(ModalController);
  editProfile = signal(false);
  editPassword = signal(false);

  profileForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    })
  });

  passwordForm = new FormGroup({
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)] 
    }),
    password2: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  changeVisualization(type: string){
    switch (type){
      case "profile":
        this.editProfile.update((state) => !state);
        break;
      case "password":
        this.editPassword.update((state) => !state);
        break;
    }
  }

  async openModal(type: string){
    const modal = await this.#modalCtrl.create({
      component: ModalContentComponent,
      componentProps: { name: this.user().name },
    });
    await modal.present();
    const result = await modal.onDidDismiss();
    if (result.data && result.data.food) {
      this.food.set(result.data.food);
    }
  }

  updateProfile() {
    const userProfile: UserProfileEdit = {
      ...this.profileForm.getRawValue()
    }

    this.#userService.saveProfile(userProfile)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.user().name = userProfile.name;
          this.user().email = userProfile.email;
          this.showSuccessToast("Profile updated!")
          this.changeVisualization("profile");
          this.profileForm.reset();
        },
        error: async () => {
          (
            await this.#alertCtrl.create({
              header: 'Update error',
              message: 'Incorrect email and/or password',
              buttons: ['Ok'],
            })
          ).present();
          this.changeVisualization("profile");
      }
  });
  }

  updatePassword(){
    const userPassword: UserPasswordEdit = {
      password: this.passwordForm.get("password")?.getRawValue()
    };

    this.#userService.savePassword(userPassword)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.user().password = userPassword.password;
          this.showSuccessToast("Password updated");
          this.passwordForm.reset();
          this.changeVisualization("password");
        },
        error: async (error) => {
          (
            await this.#alertCtrl.create({
              header: 'Update error',
              message: error, //TODO: Modificar
              buttons: ['Ok'],
            })
          ).present();
          this.passwordForm.reset();
          this.changeVisualization("password");
        }
      })
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

  async showSuccessToast(message: string) {
    const toast = await this.#toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom',
      color: 'success',
      buttons: [
        {
          icon: 'close-circle',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }
}
