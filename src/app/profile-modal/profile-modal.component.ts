import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserProfile } from '../services/profile';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
  standalone: false,
})
export class ProfileModalComponent {
  @Input() profile!: UserProfile;

  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }
}