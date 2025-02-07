import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController, ToastController, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonInput, IonItem, IonCol, IonRow } from '@ionic/angular/standalone';
import { ValueEqualsDirective } from 'src/app/shared/directives/value-equals.directive';
import { UserPasswordEdit, UserProfileEdit } from 'src/app/auth/interfaces/user';
import { UsersService } from 'src/app/profile/services/users.service';

@Component({
  selector: 'modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss'],
  imports: [ IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonInput, IonItem, IonCol, IonRow, ReactiveFormsModule, ValueEqualsDirective ]
})
export class ModalContentComponent  {
  #modalCtrl = inject(ModalController);
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

  ionViewWillEnter() {
    if (this.profile){
      this.profileForm.get('name')!.setValue(this.username);
      this.profileForm.get('email')!.setValue(this.userEmail);
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
          this.#modalCtrl.dismiss({ name: userProfile.name, email: userProfile.email});
          this.showToast("Profile updated!", "success");
          this.profile = false;
          this.profileForm.reset();
        },
        error: async () => {
          this.showToast("Profile's updating failed. Try again later", "danger");
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
          this.showToast("Password updated", "success");
          this.password = false;
          this.passwordForm.reset();
        },
        error: async () => {
          this.showToast("Password's updating failed. Try again later", "danger");
        }
      })
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

  close() {
    this.#modalCtrl.dismiss();
  }
}
