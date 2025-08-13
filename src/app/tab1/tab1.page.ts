import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { ProfileFormModalComponent } from '../components/profile-form-modal/profile-form-modal.component';
import { ProfileService, UserProfile } from '../services/profile';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  profiles: UserProfile[] = [];
  filteredProfiles: UserProfile[] = [];
  searchTerm: string = '';

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.profileService.profiles$.subscribe(profiles => {
      this.profiles = profiles;
      this.filterProfiles();
    });
  }

  loadProfiles() {
    // Data is now managed by the service
    // This method is kept for the refresh functionality
    this.filterProfiles();
  }

  filterProfiles() {
    if (this.searchTerm.trim() === '') {
      this.filteredProfiles = [...this.profiles];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredProfiles = this.profiles.filter(profile =>
        profile.name.toLowerCase().includes(term) ||
        profile.email.toLowerCase().includes(term) ||
        profile.role.toLowerCase().includes(term)
      );
    }
  }

  async viewProfile(profile: UserProfile) {
    const modal = await this.modalController.create({
      component: ProfileModalComponent,
      componentProps: {
        profile: profile
      }
    });
    return await modal.present();
  }

  async addProfile() {
    const modal = await this.modalController.create({
      component: ProfileFormModalComponent,
      cssClass: 'profile-form-modal'
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'save' && data) {
      const newProfile: UserProfile = {
        id: Date.now(),
        ...data
      };
      this.profileService.addProfile(newProfile);
      await this.showToast('Perfil agregado correctamente', 'success');
    }
  }

  async editProfile(profile: UserProfile) {
    const modal = await this.modalController.create({
      component: ProfileFormModalComponent,
      componentProps: {
        profile: profile
      },
      cssClass: 'profile-form-modal'
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'save' && data) {
      const updatedProfile: UserProfile = {
        ...profile,
        ...data
      };
      this.profileService.updateProfile(updatedProfile);
      await this.showToast('Perfil actualizado correctamente', 'success');
    }
  }

  async deleteProfile(profile: UserProfile) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de eliminar el perfil de ${profile.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            this.profileService.deleteProfile(profile.id);
            await this.showToast('Perfil eliminado');
          }
        }
      ]
    });
    await alert.present();
  }

  async handleRefresh(event: any) {
    setTimeout(() => {
      this.loadProfiles();
      event.target.complete();
    }, 1500);
  }

  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color,
      cssClass: 'custom-toast'
    });
    await toast.present();
  }
}