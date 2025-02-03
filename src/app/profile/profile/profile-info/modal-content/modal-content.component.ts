import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController, AlertController, ToastController, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonInput, IonItem, IonCol, IonRow } from '@ionic/angular/standalone';
import { UserPasswordEdit, UserProfileEdit } from 'src/app/auth/interfaces/user';
import { UsersService } from 'src/app/profile/services/users.service';
import { ValueEqualsDirective } from 'src/app/shared/directives/value-equals.directive';

@Component({
  selector: 'modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss'],
  imports: [ IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonInput, IonItem, IonCol, IonRow, ReactiveFormsModule, ValueEqualsDirective ]
})
export class ModalContentComponent  {
  #modalCtrl = inject(ModalController);
  #alertCtrl = inject(AlertController);
  #toastCtrl = inject(ToastController);
  #userService = inject(UsersService);
  #destroyRef = inject(DestroyRef);

  title = ''; 
  username = '';
  userEmail = '';

  profile = false;
  password = false;

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

  updateProfile() {
    const userProfile: UserProfileEdit = {
      ...this.profileForm.getRawValue()
    }

    this.#userService.saveProfile(userProfile)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.#modalCtrl.dismiss({ name: userProfile.name, email: userProfile.email});
          this.showSuccessToast("Profile updated!");
          this.profile = false;
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
          this.#modalCtrl.dismiss({ password: userPassword.password });
          this.showSuccessToast("Password updated");
          this.password = false;
          this.passwordForm.reset();
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
        }
      })
  }

  async showSuccessToast(message: string) {
    const toast = await this.#toastCtrl.create({
      message: message,
      duration: 3000,
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

  close() {
    this.#modalCtrl.dismiss();
  }
}
